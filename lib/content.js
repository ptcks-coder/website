import { generateHTML, Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import TiptapUnderline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Youtube from "@tiptap/extension-youtube";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";

const lowlight = createLowlight(common);

/**
 * Versi server-safe dari node Novel `math` & `twitter` (aslinya memakai komponen
 * React, sehingga tidak bisa dipakai di server untuk generateHTML).
 */
const MathNode = Node.create({
  name: "math",
  inline: true,
  group: "inline",
  atom: true,
  selectable: true,
  marks: "",
  addAttributes() {
    return { latex: { default: "" } };
  },
  parseHTML() {
    return [{ tag: 'span[data-type="math"]' }];
  },
  renderHTML({ node, HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { "data-type": "math" }), node.attrs.latex ?? ""];
  },
  renderText({ node }) {
    return node.attrs.latex ?? "";
  }
});

const TwitterNode = Node.create({
  name: "twitter",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return { src: { default: null } };
  },
  parseHTML() {
    return [{ tag: "div[data-twitter]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-twitter": "" }, HTMLAttributes)];
  }
});

/** Ekstensi render sisi server — harus selaras dengan ekstensi editor Novel. */
export const renderExtensions = [
  StarterKit.configure({
    dropcursor: false,
    gapcursor: false,
    codeBlock: false
  }),
  TiptapImage.configure({ inline: false }),
  TiptapLink.configure({ openOnClick: false }),
  TiptapUnderline,
  Highlight.configure({ multicolor: true }),
  TaskList,
  TaskItem,
  TextStyle,
  Color,
  Youtube,
  CodeBlockLowlight.configure({ lowlight }),
  MathNode,
  TwitterNode
];

const ALLOWED = new Set(
  renderExtensions.flatMap((ext) => {
    const names = [];
    if (ext.name) names.push(ext.name);
    return names;
  })
);
ALLOWED.add("doc");
ALLOWED.add("text");
ALLOWED.add("paragraph");
ALLOWED.add("hardBreak");

/**
 * Buang node/mark yang tidak dikenal renderer agar generateHTML tidak gagal.
 */
export function sanitizeDoc(node) {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    return node.map(sanitizeDoc).filter(Boolean);
  }
  if (node.type && !ALLOWED.has(node.type)) return null;
  const next = { ...node };
  if (Array.isArray(node.content)) {
    next.content = node.content.map(sanitizeDoc).filter(Boolean);
  }
  if (Array.isArray(node.marks)) {
    next.marks = node.marks.map(sanitizeDoc).filter(Boolean);
  }
  return next;
}

/** Buat dokumen Tiptap JSON sederhana dari array paragraf (dipakai seed). */
export function paragraphsToDoc(paragraphs) {
  return {
    type: "doc",
    content: (paragraphs || []).map((p) => ({
      type: "paragraph",
      content: [{ type: "text", text: p }]
    }))
  };
}

export function docToHtml(doc) {
  if (!doc || typeof doc !== "object") return "";
  try {
    return generateHTML(sanitizeDoc(doc), renderExtensions);
  } catch (error) {
    console.error("Gagal render konten:", error);
    return "";
  }
}

export function paragraphsToHtml(paragraphs) {
  return docToHtml(paragraphsToDoc(paragraphs));
}
