import type { ReactNode } from "react";
import { Fragment } from "react";
import { parseMarkdown, type InlineNode } from "@/lib/rich-text/ast";

/**
 * Renderizador do markdown-lite do site (ver lib/rich-text/ast.ts), sem
 * dependência externa e sem `dangerouslySetInnerHTML` — o texto vem do
 * admin, mas seguimos tratando como dado, não como HTML.
 *
 * O mesmo formato é editado visualmente no admin
 * (components/admin/rich-text-editor.tsx), então tudo que o editor produz
 * este componente sabe renderizar: parágrafos, **negrito**, *itálico*,
 * __sublinhado__, ~~riscado~~, listas ("-" e numeradas), subtítulos
 * ("##"/"###") e [links](https://…).
 */

function renderInline(nodes: InlineNode[]): ReactNode[] {
  return nodes.map((node, i) => {
    switch (node.type) {
      case "text":
        return <Fragment key={i}>{node.text}</Fragment>;
      case "br":
        return <br key={i} />;
      case "strong":
        return <strong key={i}>{renderInline(node.children)}</strong>;
      case "em":
        return <em key={i}>{renderInline(node.children)}</em>;
      case "u":
        return (
          <u key={i} className="underline underline-offset-4">
            {renderInline(node.children)}
          </u>
        );
      case "s":
        return <s key={i}>{renderInline(node.children)}</s>;
      case "link":
        return (
          <a
            key={i}
            href={node.href}
            target={node.href.startsWith("/") ? undefined : "_blank"}
            rel={node.href.startsWith("/") ? undefined : "noopener noreferrer"}
            className="underline underline-offset-4 decoration-accent hover:text-accent"
          >
            {renderInline(node.children)}
          </a>
        );
    }
  });
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = parseMarkdown(text);

  if (blocks.length === 0) return null;

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block.type === "list") {
          const items = block.items.map((item, i) => <li key={i}>{renderInline(item)}</li>);
          return block.ordered ? (
            <ol key={index} className="list-decimal space-y-2 pl-5">
              {items}
            </ol>
          ) : (
            <ul key={index} className="list-disc space-y-2 pl-5">
              {items}
            </ul>
          );
        }

        if (block.type === "heading") {
          const content = renderInline(block.children);
          return block.level === 2 ? (
            <h3 key={index} className="font-display text-xl font-medium text-foreground">
              {content}
            </h3>
          ) : (
            <h4 key={index} className="text-base font-semibold text-foreground">
              {content}
            </h4>
          );
        }

        return <p key={index}>{renderInline(block.children)}</p>;
      })}
    </div>
  );
}
