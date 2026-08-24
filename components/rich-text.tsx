import type { ReactNode } from "react";
import { Fragment } from "react";

/**
 * Renderizador de texto rico estilo markdown, sem dependência externa e sem
 * `dangerouslySetInnerHTML` (o texto vem do admin, mas seguimos tratando como
 * dado, não como HTML). Suporta o que a edição do site precisa:
 *
 * - parágrafos separados por linha em branco
 * - **negrito** e *itálico*
 * - listas com "-" ou "*" e listas numeradas ("1.", "2.", …)
 * - subtítulos com "## " ou "### "
 * - [links](https://...)
 *
 * Qualquer coisa fora disso é renderizada como texto puro.
 */

const INLINE_PATTERN = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE_PATTERN).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const href = link[2];
      if (/^(https?:\/\/|mailto:|\/)/.test(href)) {
        return (
          <a
            key={i}
            href={href}
            target={href.startsWith("/") ? undefined : "_blank"}
            rel={href.startsWith("/") ? undefined : "noopener noreferrer"}
            className="underline underline-offset-4 decoration-accent hover:text-accent"
          >
            {link[1]}
          </a>
        );
      }
      return <Fragment key={i}>{link[1]}</Fragment>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Quebras de linha simples dentro do mesmo bloco viram <br />. */
function renderLines(block: string): ReactNode[] {
  return block.split("\n").map((line, i, lines) => (
    <Fragment key={i}>
      {renderInline(line)}
      {i < lines.length - 1 && <br />}
    </Fragment>
  ));
}

const BULLET = /^[-*]\s+/;
const ORDERED = /^\d+[.)]\s+/;

export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  if (blocks.length === 0) return null;

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

        if (lines.every((l) => BULLET.test(l))) {
          return (
            <ul key={index} className="list-disc space-y-2 pl-5">
              {lines.map((line, i) => (
                <li key={i}>{renderInline(line.replace(BULLET, ""))}</li>
              ))}
            </ul>
          );
        }

        if (lines.every((l) => ORDERED.test(l))) {
          return (
            <ol key={index} className="list-decimal space-y-2 pl-5">
              {lines.map((line, i) => (
                <li key={i}>{renderInline(line.replace(ORDERED, ""))}</li>
              ))}
            </ol>
          );
        }

        const heading = block.match(/^(#{2,3})\s+([\s\S]+)$/);
        if (heading) {
          const content = renderInline(heading[2].trim());
          return heading[1].length === 2 ? (
            <h3 key={index} className="font-display text-xl font-medium text-foreground">
              {content}
            </h3>
          ) : (
            <h4 key={index} className="text-base font-semibold text-foreground">
              {content}
            </h4>
          );
        }

        return <p key={index}>{renderLines(block)}</p>;
      })}
    </div>
  );
}
