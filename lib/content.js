import { generateHTML } from "@tiptap/core";
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

/** Ekstensi render sisi server — harus selaras dengan ekstensi editor Novel. */
export const renderExtensions = [
  StarterKit.configure({
    dropcursor: false,
    gapcursor: false
  }),
  TiptapImage.configure({ inline: false }),
  TiptapLink.configure({ openOnClick: false }),
  TiptapUnderline,
  Highlight.configure({ multicolor: true }),
  TaskList,
  TaskItem,
  TextStyle,
  Color,
  Youtube
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
