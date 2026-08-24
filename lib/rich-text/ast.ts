/**
 * AST compartilhada do "markdown-lite" do site — o formato em que os textos
 * ricos são salvos (bio do /sobre e seções de texto dos cases).
 *
 * Dois consumidores:
 * - components/rich-text.tsx renderiza a AST no site público;
 * - components/admin/rich-text-editor.tsx converte AST ↔ documento Tiptap
 *   para edição visual no admin.
 *
 * Sintaxe suportada: parágrafos (linha em branco), **negrito**, *itálico*,
 * __sublinhado__ (convenção nossa — não é o negrito do markdown padrão),
 * ~~riscado~~, listas com "-"/"*", listas numeradas ("1."), subtítulos
 * ("## " e "### "), [links](https://…) e quebra de linha simples.
 */

export type InlineNode =
  | { type: "text"; text: string }
  | { type: "br" }
  | { type: "strong"; children: InlineNode[] }
  | { type: "em"; children: InlineNode[] }
  | { type: "u"; children: InlineNode[] }
  | { type: "s"; children: InlineNode[] }
  | { type: "link"; href: string; children: InlineNode[] };

export type BlockNode =
  | { type: "paragraph"; children: InlineNode[] }
  | { type: "heading"; level: 2 | 3; children: InlineNode[] }
  | { type: "list"; ordered: boolean; items: InlineNode[][] };

const BULLET = /^[-*]\s+/;
const ORDERED = /^\d+[.)]\s+/;
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)/;

const WRAPPERS: Array<{ delim: string; type: "strong" | "u" | "s" | "em" }> = [
  { delim: "**", type: "strong" },
  { delim: "__", type: "u" },
  { delim: "~~", type: "s" },
  { delim: "*", type: "em" },
];

/** Parse recursivo de formatação inline (suporta aninhamento: **a *b* c**). */
export function parseInline(source: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let buffer = "";

  const flush = () => {
    if (buffer) {
      nodes.push({ type: "text", text: buffer });
      buffer = "";
    }
  };

  let i = 0;
  outer: while (i < source.length) {
    if (source[i] === "\n") {
      flush();
      nodes.push({ type: "br" });
      i += 1;
      continue;
    }

    if (source[i] === "[") {
      const match = source.slice(i).match(LINK);
      if (match && /^(https?:\/\/|mailto:|\/)/.test(match[2])) {
        flush();
        nodes.push({ type: "link", href: match[2], children: parseInline(match[1]) });
        i += match[0].length;
        continue;
      }
    }

    // "***x***" (negrito + itálico) antes do teste de "**" — senão o inner
    // ficaria com asteriscos soltos.
    if (source.startsWith("***", i)) {
      const close = source.indexOf("***", i + 3);
      if (close > i + 3) {
        flush();
        nodes.push({
          type: "strong",
          children: [{ type: "em", children: parseInline(source.slice(i + 3, close)) }],
        });
        i = close + 3;
        continue;
      }
    }

    for (const { delim, type } of WRAPPERS) {
      if (source.startsWith(delim, i)) {
        const close = source.indexOf(delim, i + delim.length);
        if (close > i + delim.length) {
          const inner = source.slice(i + delim.length, close);
          // Delimitador de 1 char (*) não pode "fechar" no meio de um ** —
          // como ** é testado antes, aqui inner nunca começa com *.
          if (inner.trim()) {
            flush();
            nodes.push({ type, children: parseInline(inner) });
            i = close + delim.length;
            continue outer;
          }
        }
      }
    }

    buffer += source[i];
    i += 1;
  }

  flush();
  return nodes;
}

/** Parse do texto completo em blocos (parágrafos, listas, títulos). */
export function parseMarkdown(text: string): BlockNode[] {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((block): BlockNode => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

    if (lines.every((l) => BULLET.test(l))) {
      return { type: "list", ordered: false, items: lines.map((l) => parseInline(l.replace(BULLET, ""))) };
    }

    if (lines.every((l) => ORDERED.test(l))) {
      return { type: "list", ordered: true, items: lines.map((l) => parseInline(l.replace(ORDERED, ""))) };
    }

    const heading = block.match(/^(#{2,3})\s+([\s\S]+)$/);
    if (heading) {
      return {
        type: "heading",
        level: heading[1].length === 2 ? 2 : 3,
        children: parseInline(heading[2].trim()),
      };
    }

    return { type: "paragraph", children: parseInline(block) };
  });
}

export function serializeInline(nodes: InlineNode[]): string {
  return nodes
    .map((node) => {
      switch (node.type) {
        case "text":
          return node.text;
        case "br":
          return "\n";
        case "strong":
          return `**${serializeInline(node.children)}**`;
        case "em":
          return `*${serializeInline(node.children)}*`;
        case "u":
          return `__${serializeInline(node.children)}__`;
        case "s":
          return `~~${serializeInline(node.children)}~~`;
        case "link":
          return `[${serializeInline(node.children)}](${node.href})`;
      }
    })
    .join("");
}

export function serializeMarkdown(blocks: BlockNode[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return serializeInline(block.children);
        case "heading":
          return `${"#".repeat(block.level)} ${serializeInline(block.children)}`;
        case "list":
          return block.items
            .map((item, i) => `${block.ordered ? `${i + 1}. ` : "- "}${serializeInline(item)}`)
            .join("\n");
      }
    })
    .filter((s) => s.trim())
    .join("\n\n");
}
