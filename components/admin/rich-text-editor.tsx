"use client";

import { useEffect, useRef } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { docToMarkdown, markdownToDoc } from "@/lib/rich-text/prosemirror";

interface RichTextEditorProps {
  /** Markdown-lite (o formato salvo no banco — ver lib/rich-text/ast.ts). */
  value: string;
  onChange: (markdown: string) => void;
  /** Altura mínima da área de texto, em linhas aproximadas. */
  minRows?: number;
  id?: string;
}

/**
 * Editor de texto rico do admin (Tiptap). A pessoa edita visualmente — com
 * barra de formatação e atalhos de markdown enquanto digita ("- " ou "* "
 * vira lista, "1. " vira lista numerada, "## " vira subtítulo, "**x**" vira
 * negrito) — e o valor trafega como markdown-lite, o mesmo formato que o
 * site público renderiza em components/rich-text.tsx.
 */
export function RichTextEditor({ value, onChange, minRows = 6, id }: RichTextEditorProps) {
  const lastMarkdown = useRef(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
        },
      }),
    ],
    content: markdownToDoc(value),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        id: id ?? "",
        class: "rte-content focus:outline-none px-3 py-2 text-sm",
        style: `min-height: ${minRows * 1.6}rem`,
      },
    },
    onUpdate: ({ editor }) => {
      const markdown = docToMarkdown(editor.getJSON());
      lastMarkdown.current = markdown;
      onChange(markdown);
    },
  });

  // Se o valor mudar por fora (reset do form), atualiza o editor sem loop.
  useEffect(() => {
    if (editor && value !== lastMarkdown.current) {
      lastMarkdown.current = value;
      editor.commands.setContent(markdownToDoc(value));
    }
  }, [value, editor]);

  return (
    <div className="rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor
        ? {
            bold: editor.isActive("bold"),
            italic: editor.isActive("italic"),
            underline: editor.isActive("underline"),
            strike: editor.isActive("strike"),
            bulletList: editor.isActive("bulletList"),
            orderedList: editor.isActive("orderedList"),
            h2: editor.isActive("heading", { level: 2 }),
            h3: editor.isActive("heading", { level: 3 }),
            link: editor.isActive("link"),
          }
        : null,
  });

  if (!editor || !state) {
    return <div className="h-9 border-b border-border" aria-hidden />;
  }

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Endereço do link (https://…)", previous ?? "https://");
    if (url === null) return;
    if (!url.trim() || url.trim() === "https://") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  return (
    <div
      className="flex flex-wrap items-center gap-0.5 border-b border-border px-1.5 py-1"
      role="toolbar"
      aria-label="Formatação de texto"
    >
      <ToolbarButton
        label="Negrito (Ctrl+B)"
        active={state.bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Itálico (Ctrl+I)"
        active={state.italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Sublinhado (Ctrl+U)"
        active={state.underline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Riscado"
        active={state.strike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        label="Lista"
        active={state.bulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Lista numerada"
        active={state.orderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        label="Subtítulo"
        active={state.h2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Subtítulo menor"
        active={state.h3}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton label="Adicionar/editar link" active={state.link} onClick={setLink}>
        <Link2 className="size-4" />
      </ToolbarButton>
      {state.link && (
        <ToolbarButton
          label="Remover link"
          active={false}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Link2Off className="size-4" />
        </ToolbarButton>
      )}
    </div>
  );
}

function ToolbarButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
        active && "bg-secondary text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="mx-1 h-4 w-px bg-border" aria-hidden />;
}
