"use client";

import { useCallback, useMemo, useState } from "react";
import {
  EditorRoot,
  EditorContent,
  EditorCommand,
  EditorCommandList,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorBubble,
  EditorBubbleItem,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
  createSuggestionItems,
  renderItems,
  createImageUpload,
  StarterKit,
  TiptapImage,
  UpdatedImage,
  TiptapLink,
  TiptapUnderline,
  TaskList,
  TaskItem,
  HighlightExtension,
  HorizontalRule,
  Placeholder,
  CharacterCount,
  Youtube,
  Command,
  CustomKeymap,
  GlobalDragHandle,
  UploadImagesPlugin,
  TextStyle,
  Color,
  ImageResizer,
  AIHighlight,
  CodeBlockLowlight,
  Mathematics,
  Twitter
} from "novel";
import EditorToolbar from "@/components/admin/EditorToolbar";
import { createLowlight, common } from "lowlight";
import "katex/dist/katex.min.css";

const MAX_SIZE = 10 * 1024 * 1024;
const lowlight = createLowlight(common);

async function uploadToServer(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.error || "Upload gagal");
  return data.url;
}

const uploadFn = createImageUpload({
  validateFn: (file) => {
    if (!file.type.startsWith("image/")) return false;
    if (file.size > MAX_SIZE) return false;
    return true;
  },
  onUpload: uploadToServer
});

const Icon = {
  Text: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path strokeLinecap="round" d="M4 6h16M9 6v12" />
    </svg>
  ),
  H1: <span className="text-xs font-bold">H1</span>,
  H2: <span className="text-xs font-bold">H2</span>,
  H3: <span className="text-xs font-bold">H3</span>,
  Todo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="3" y="5" width="12" height="12" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 11 2 2 4-4M16 8h5M16 12h5" />
    </svg>
  ),
  Ul: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path strokeLinecap="round" d="M9 6h12M9 12h12M9 18h12" />
      <circle cx="4.5" cy="6" r="1" fill="currentColor" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" />
      <circle cx="4.5" cy="18" r="1" fill="currentColor" />
    </svg>
  ),
  Ol: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path strokeLinecap="round" d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3H4c0-1 2-2 2-3" />
    </svg>
  ),
  Quote: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path strokeLinecap="round" d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6" />
    </svg>
  ),
  Code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8 8-4 4 4 4m8-8 4 4-4 4" />
    </svg>
  ),
  Hr: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path strokeLinecap="round" d="M4 12h16" />
    </svg>
  ),
  Image: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 18 5-5 3 3 3-3 3 3" />
    </svg>
  ),
  Youtube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path fill="currentColor" d="m10 9.5 5 2.5-5 2.5z" stroke="none" />
    </svg>
  ),
  Link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path strokeLinecap="round" d="M10 14a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1M14 10a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1" />
    </svg>
  ),
  Twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.6-8.7L1.7 2h6.8l4.7 6.2L18.9 2Zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20Z" />
    </svg>
  ),
  Math: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M18 4H6l6 8-6 8h12" />
    </svg>
  )
};

function headingCommand(level) {
  return ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setNode("heading", { level }).run();
  };
}

const suggestionItems = createSuggestionItems([
  {
    title: "Teks",
    description: "Paragraf biasa.",
    icon: Icon.Text,
    searchTerms: ["p", "paragraph", "teks"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
    }
  },
  { title: "Heading 1", description: "Judul besar.", icon: Icon.H1, searchTerms: ["h1", "judul"], command: headingCommand(1) },
  { title: "Heading 2", description: "Sub judul.", icon: Icon.H2, searchTerms: ["h2"], command: headingCommand(2) },
  { title: "Heading 3", description: "Sub judul kecil.", icon: Icon.H3, searchTerms: ["h3"], command: headingCommand(3) },
  {
    title: "Daftar centang",
    description: "Task list dengan checkbox.",
    icon: Icon.Todo,
    searchTerms: ["todo", "task", "checklist"],
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleTaskList().run()
  },
  {
    title: "Daftar poin",
    description: "Bullet list.",
    icon: Icon.Ul,
    searchTerms: ["bullet", "list", "ul"],
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run()
  },
  {
    title: "Daftar nomor",
    description: "Numbered list.",
    icon: Icon.Ol,
    searchTerms: ["number", "ordered", "ol"],
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run()
  },
  {
    title: "Kutipan",
    description: "Blockquote.",
    icon: Icon.Quote,
    searchTerms: ["quote", "kutipan"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").toggleBlockquote().run()
  },
  {
    title: "Kode",
    description: "Blok kode.",
    icon: Icon.Code,
    searchTerms: ["code", "kode"],
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
  },
  {
    title: "Garis pemisah",
    description: "Horizontal rule.",
    icon: Icon.Hr,
    searchTerms: ["divider", "hr", "garis"],
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run()
  },
  {
    title: "Gambar",
    description: "Unggah gambar dari komputer.",
    icon: Icon.Image,
    searchTerms: ["image", "gambar", "foto", "img"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        if (!input.files?.length) return;
        const file = input.files[0];
        const pos = editor.view.state.selection.from;
        uploadFn(file, editor.view, pos);
      };
      input.click();
    }
  },
  {
    title: "Youtube",
    description: "Sematkan video YouTube.",
    icon: Icon.Youtube,
    searchTerms: ["youtube", "video"],
    command: ({ editor, range }) => {
      const url = window.prompt("Tempel URL video YouTube:");
      if (url) {
        editor.chain().focus().deleteRange(range).setYoutubeVideo({ src: url }).run();
      }
    }
  },
  {
    title: "Twitter",
    description: "Sematkan tweet (X).",
    icon: Icon.Twitter,
    searchTerms: ["twitter", "x", "tweet"],
    command: ({ editor, range }) => {
      const url = window.prompt("Tempel URL tweet (X):");
      if (url) {
        editor.chain().focus().deleteRange(range).setTweet({ src: url }).run();
      }
    }
  },
  {
    title: "Rumus (LaTeX)",
    description: "Sisipkan rumus matematika.",
    icon: Icon.Math,
    searchTerms: ["math", "latex", "rumus", "formula", "equation"],
    command: ({ editor, range }) => {
      const latex = window.prompt("Masukkan LaTeX (mis. E = mc^2):");
      if (latex) {
        editor.chain().focus().deleteRange(range).setLatex({ latex }).run();
      }
    }
  }
]);

const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems
  }
});

// Plugin upload harus dilekatkan ke extension Image, bukan sebagai item extensions.
const tipTapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [UploadImagesPlugin({ imageClass: "opacity-60 rounded-lg" })];
  }
}).configure({
  allowBase64: true,
  HTMLAttributes: { class: "rounded-lg" }
});

export default function NovelEditor({ initialContent, onUpdate }) {
  const [editor, setEditor] = useState(null);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc list-outside" } },
        orderedList: { HTMLAttributes: { class: "list-decimal list-outside" } },
        horizontalRule: false,
        codeBlock: false
      }),
      Placeholder.configure({
        placeholder: ({ node }) =>
          node.type.name === "heading"
            ? `Heading ${node.attrs.level}`
            : "Tulis konten di sini, atau ketik '/' untuk perintah…"
      }),
      tipTapImage,
      UpdatedImage.configure({ HTMLAttributes: { class: "rounded-lg" } }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline underline-offset-2" }
      }),
      TiptapUnderline,
      TaskList,
      TaskItem.configure({ nested: true }),
      HighlightExtension,
      HorizontalRule,
      TextStyle,
      Color,
      Youtube.configure({ width: 640, height: 360, HTMLAttributes: { class: "rounded-lg" } }),
      Twitter.configure({ inline: false }),
      Mathematics.configure({ katexOptions: { throwOnError: false } }),
      CodeBlockLowlight.configure({ lowlight }),
      AIHighlight,
      CharacterCount,
      CustomKeymap,
      GlobalDragHandle,
      slashCommand
    ],
    []
  );

  const insertImage = useCallback(() => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      if (!input.files?.length) return;
      const file = input.files[0];
      const pos = editor.view.state.selection.from;
      uploadFn(file, editor.view, pos);
    };
    input.click();
  }, [editor]);

  return (
    <EditorRoot>
      <div className="ck-editor-shell">
        <EditorToolbar editor={editor} onInsertImage={insertImage} />
        <EditorContent
          immediatelyRender={false}
          initialContent={initialContent || undefined}
          extensions={extensions}
          onCreate={({ editor }) => {
            setEditor(editor);
            onUpdate?.(editor.getJSON(), editor.getHTML());
          }}
          className="ck-editor-wrap relative min-h-[420px] w-full"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event)
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose prose-base max-w-none prose-headings:font-bold focus:outline-none text-gray-800"
            }
          }}
          onUpdate={({ editor }) => onUpdate?.(editor.getJSON(), editor.getHTML())}
          slotAfter={<ImageResizer />}
        >
        <EditorCommand className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-lg border border-gray-200 bg-white px-1 py-2 shadow-xl">
          <EditorCommandEmpty className="px-2 text-sm text-gray-500">
            Tidak ada hasil
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                key={item.title}
                value={item.title}
                onCommand={(val) => item.command(val)}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-gray-800 hover:bg-blue-50 aria-selected:bg-blue-50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 bg-white text-gray-500">
                  {item.icon}
                </span>
                <span>
                  <span className="block font-medium">{item.title}</span>
                  <span className="block text-xs text-gray-400">{item.description}</span>
                </span>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>

        <EditorBubble
          tippyOptions={{
            placement: "top",
            zIndex: 9999,
            interactive: true,
            appendTo: () => document.body
          }}
          className="flex w-fit items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
        >
          <EditorBubbleItem
            onSelect={(editor) => editor.chain().focus().toggleBold().run()}
            onMouseDown={(e) => e.preventDefault()}
            className="cursor-pointer rounded px-2 py-1 text-sm font-bold text-gray-700 hover:bg-gray-100"
          >
            B
          </EditorBubbleItem>
          <EditorBubbleItem
            onSelect={(editor) => editor.chain().focus().toggleItalic().run()}
            onMouseDown={(e) => e.preventDefault()}
            className="cursor-pointer rounded px-2 py-1 text-sm italic text-gray-700 hover:bg-gray-100"
          >
            I
          </EditorBubbleItem>
          <EditorBubbleItem
            onSelect={(editor) => editor.chain().focus().toggleUnderline().run()}
            onMouseDown={(e) => e.preventDefault()}
            className="cursor-pointer rounded px-2 py-1 text-sm text-gray-700 underline hover:bg-gray-100"
          >
            U
          </EditorBubbleItem>
          <EditorBubbleItem
            onSelect={(editor) => editor.chain().focus().toggleStrike().run()}
            onMouseDown={(e) => e.preventDefault()}
            className="cursor-pointer rounded px-2 py-1 text-sm text-gray-700 line-through hover:bg-gray-100"
          >
            S
          </EditorBubbleItem>
          <EditorBubbleItem
            onSelect={(editor) => editor.chain().focus().toggleCode().run()}
            onMouseDown={(e) => e.preventDefault()}
            className="cursor-pointer rounded px-2 py-1 font-mono text-xs text-gray-700 hover:bg-gray-100"
          >
            {"</>"}
          </EditorBubbleItem>
          <EditorBubbleItem
            onSelect={(editor) => {
              const prev = editor.getAttributes("link").href;
              const url = window.prompt("URL tautan:", prev || "https://");
              if (url === null) return;
              if (url === "") editor.chain().focus().unsetLink().run();
              else editor.chain().focus().setLink({ href: url }).run();
            }}
            onMouseDown={(e) => e.preventDefault()}
            className="cursor-pointer rounded px-2 py-1 text-gray-700 hover:bg-gray-100"
          >
            {Icon.Link}
          </EditorBubbleItem>
        </EditorBubble>
        </EditorContent>
      </div>
    </EditorRoot>
  );
}
