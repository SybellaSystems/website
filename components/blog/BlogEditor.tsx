"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import { useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import ImageInsertModal from "./ImageInsertModal";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  ImagePlus,
  Undo2,
  Redo2,
  Minus,
} from "lucide-react";

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
  onInsertImage?: () => void;
}

export default function BlogEditor({
  value,
  onChange,
  onInsertImage,
}: BlogEditorProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const adminToken =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,

      Underline,

      Image.configure({
        inline: false,
        allowBase64: false,
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),

      Placeholder.configure({
        placeholder: "Start writing your blog...",
      }),
    ],

    content: value,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });const insertImage = (image: {
  src: string;
  alt: string;
  align: "left" | "center" | "right";
  wrap: boolean;
  width: string;
}) => {
  if (!editor) {
    return;
  }

  const currentEditor = editor;

  currentEditor
    .chain()
    .focus()
    .setImage({
      src: image.src,
      alt: image.alt,
      title: image.alt,
    })
    .run();
};
  if (!editor) {
    return (
      <div className="min-h-[450px] animate-pulse rounded-xl border border-gray-200 bg-gray-50" />
    );
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;

    const url = window.prompt("Enter URL", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    setImageModalOpen(true);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-slate-900">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-slate-800">
        {/* Undo / Redo */}
        <ToolbarButton
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo2 size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo2 size={17} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton
          title="Heading 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 size={17} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Formatting */}
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={17} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={17} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Link */}
        <ToolbarButton
          title="Add link"
          active={editor.isActive("link")}
          onClick={addLink}
        >
          <LinkIcon size={17} />
        </ToolbarButton>

        {/* Image */}
        <ToolbarButton title="Insert image" onClick={addImage}>
          <ImagePlus size={17} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="blog-editor-content min-h-[450px] px-6 py-5"
      />
      <ImageInsertModal
  open={imageModalOpen}
  onClose={() => setImageModalOpen(false)}
  onInsert={insertImage}
  adminToken={adminToken}
/>
      {/* Footer */}
      <div className="flex justify-between border-t border-gray-200 px-4 py-2 text-xs text-gray-500 dark:border-gray-700">
        <span>Rich text editor</span>

        <span>{editor.getText().length} characters</span>
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  title,
  active = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
          : "text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-slate-700"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />;
}
