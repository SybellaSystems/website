"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";

import { useEffect, useState } from "react";

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
  Code2,
  CodeSquare,
  RemoveFormatting,
} from "lucide-react";

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
  onInsertImage?: () => void;
}

interface InsertImageData {
  src: string;
  alt: string;
  align: "left" | "center" | "right";
  wrap: boolean;
  width: string;
}

/*
|--------------------------------------------------------------------------
| Custom Image Extension
|--------------------------------------------------------------------------
|
| Extends Tiptap's Image node with:
|
| - alignment
| - text wrapping
| - image width
|
*/

const BlogImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      align: {
        default: "center",

        parseHTML: (element) => element.getAttribute("data-align") || "center",

        renderHTML: (attributes) => ({
          "data-align": attributes.align,
        }),
      },

      wrap: {
        default: false,

        parseHTML: (element) => element.getAttribute("data-wrap") === "true",

        renderHTML: (attributes) => ({
          "data-wrap": attributes.wrap ? "true" : "false",
        }),
      },

      width: {
        default: "100%",

        parseHTML: (element) => element.getAttribute("data-width") || "100%",

        renderHTML: (attributes) => ({
          "data-width": attributes.width,
          style: `width: ${attributes.width};`,
        }),
      },
    };
  },
});

export default function BlogEditor({ value, onChange }: BlogEditorProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const adminToken =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,

      Underline,

      BlogImage.configure({
        inline: false,
        allowBase64: false,
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),

      Placeholder.configure({
        placeholder: "Start writing your article...",
      }),
    ],

    content: value,

    editorProps: {
      attributes: {
        class: "ProseMirror blog-editor-prose focus:outline-none",
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Sync external value
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!editor) return;

    const currentHTML = editor.getHTML();

    if (value && value !== currentHTML && !editor.isFocused) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  /*
  |--------------------------------------------------------------------------
  | Insert Image
  |--------------------------------------------------------------------------
  */

  const insertImage = (image: InsertImageData) => {
    if (!editor) return;

    editor
      .chain()
      .focus()
      .setImage({
        src: image.src,
        alt: image.alt,
        title: image.alt,
        align: image.align,
        wrap: image.wrap,
        width: image.width,
      })
      .run();

    setImageModalOpen(false);
  };
  /*
  |--------------------------------------------------------------------------
  | Link
  |--------------------------------------------------------------------------
  */

  const addLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;

    const url = window.prompt("Enter URL", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().unsetLink().run();

      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: url,
      })
      .run();
  };

  /*
  |--------------------------------------------------------------------------
  | Clear formatting
  |--------------------------------------------------------------------------
  */

  const clearFormatting = () => {
    if (!editor) return;

    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  if (!editor) {
    return (
      <div className="min-h-[500px] animate-pulse rounded-2xl border border-gray-200 bg-gray-50" />
    );
  }

  return (
    <>
      <div className="blog-editor-wrapper">
        {/* =====================================================
            TOOLBAR
        ===================================================== */}

        <div className="blog-editor-toolbar">
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

          {/* =================================================
              HEADINGS
          ================================================= */}

          <ToolbarButton
            title="Heading 1"
            active={editor.isActive("heading", { level: 1 })}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({
                  level: 1,
                })
                .run()
            }
          >
            <Heading1 size={17} />
          </ToolbarButton>

          <ToolbarButton
            title="Heading 2"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({
                  level: 2,
                })
                .run()
            }
          >
            <Heading2 size={17} />
          </ToolbarButton>

          <ToolbarButton
            title="Heading 3"
            active={editor.isActive("heading", { level: 3 })}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({
                  level: 3,
                })
                .run()
            }
          >
            <Heading3 size={17} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* =================================================
              TEXT FORMATTING
          ================================================= */}

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

          {/* =================================================
              LISTS
          ================================================= */}

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
            title="Blockquote"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote size={17} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* =================================================
              LINK
          ================================================= */}

          <ToolbarButton
            title="Add link"
            active={editor.isActive("link")}
            onClick={addLink}
          >
            <LinkIcon size={17} />
          </ToolbarButton>

          {/* =================================================
              IMAGE
          ================================================= */}

          <ToolbarButton
            title="Insert image"
            onClick={() => setImageModalOpen(true)}
          >
            <ImagePlus size={17} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* =================================================
              CODE
          ================================================= */}

          <ToolbarButton
            title="Inline code"
            active={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code2 size={17} />
          </ToolbarButton>

          <ToolbarButton
            title="Code block"
            active={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <CodeSquare size={17} />
          </ToolbarButton>

          <ToolbarButton
            title="Horizontal divider"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus size={17} />
          </ToolbarButton>

          <ToolbarButton title="Clear formatting" onClick={clearFormatting}>
            <RemoveFormatting size={17} />
          </ToolbarButton>
        </div>

        {/* =====================================================
            EDITOR
        ===================================================== */}

        <div className="blog-editor-writing-area">
          <EditorContent editor={editor} />
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="blog-editor-footer">
          <span>Rich text editor</span>

          <span>{editor.getText().length.toLocaleString()} characters</span>
        </div>
      </div>

      {/* =======================================================
          IMAGE MODAL
      ======================================================= */}

      <ImageInsertModal
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onInsert={insertImage}
        adminToken={adminToken}
      />
    </>
  );
}

/* =============================================================
   TOOLBAR BUTTON
============================================================= */

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
      aria-label={title}
      onMouseDown={(event) => {
        /*
         * Prevent editor from losing selection
         * when clicking toolbar buttons.
         */
        event.preventDefault();
      }}
      onClick={onClick}
      disabled={disabled}
      className={`
        blog-toolbar-button

        ${active ? "blog-toolbar-button-active" : ""}

        ${disabled ? "blog-toolbar-button-disabled" : ""}
      `}
    >
      {children}
    </button>
  );
}

/* =============================================================
   TOOLBAR DIVIDER
============================================================= */

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-gray-200" aria-hidden="true" />;
}
