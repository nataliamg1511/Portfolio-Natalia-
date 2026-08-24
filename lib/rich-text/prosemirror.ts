import {
  parseMarkdown,
  serializeMarkdown,
  type BlockNode,
  type InlineNode,
} from "@/lib/rich-text/ast";

/**
 * Conversão entre o markdown-lite do site e o JSON de documento do
 * Tiptap/ProseMirror (usado pelo editor visual do admin). Só JSON puro —
 * nenhum import de @tiptap/* aqui, então o módulo é barato de carregar.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PMNode = any;

interface PMMark {
  type: string;
  attrs?: Record<string, unknown>;
}

const MARK_BY_TYPE: Record<string, string> = {
  strong: "bold",
  em: "italic",
  u: "underline",
  s: "strike",
};

function inlineToPM(nodes: InlineNode[], marks: PMMark[] = []): PMNode[] {
  const out: PMNode[] = [];
  for (const node of nodes) {
    if (node.type === "text") {
      if (node.text) out.push({ type: "text", text: node.text, ...(marks.length ? { marks } : {}) });
    } else if (node.type === "br") {
      out.push({ type: "hardBreak" });
    } else if (node.type === "link") {
      out.push(
        ...inlineToPM(node.children, [
          ...marks,
          { type: "link", attrs: { href: node.href, target: "_blank", rel: "noopener noreferrer" } },
        ])
      );
    } else {
      out.push(...inlineToPM(node.children, [...marks, { type: MARK_BY_TYPE[node.type] }]));
    }
  }
  return out;
}

function blockToPM(block: BlockNode): PMNode {
  if (block.type === "heading") {
    return { type: "heading", attrs: { level: block.level }, content: inlineToPM(block.children) };
  }
  if (block.type === "list") {
    return {
      type: block.ordered ? "orderedList" : "bulletList",
      ...(block.ordered ? { attrs: { start: 1 } } : {}),
      content: block.items.map((item) => ({
        type: "listItem",
        content: [{ type: "paragraph", content: inlineToPM(item) }],
      })),
    };
  }
  const content = inlineToPM(block.children);
  return { type: "paragraph", ...(content.length ? { content } : {}) };
}

export function markdownToDoc(text: string): PMNode {
  const blocks = parseMarkdown(text);
  return {
    type: "doc",
    content: blocks.length ? blocks.map(blockToPM) : [{ type: "paragraph" }],
  };
}

// ── Documento → markdown ────────────────────────────────────────────────

function pmTextToInline(node: PMNode): InlineNode {
  let result: InlineNode = { type: "text", text: node.text ?? "" };
  const marks: PMMark[] = node.marks ?? [];
  // Aplica marcas de dentro pra fora, link por último (fica mais externo).
  const order = ["bold", "italic", "underline", "strike", "link"];
  const sorted = [...marks].sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type)).reverse();
  for (const mark of sorted) {
    if (mark.type === "bold") result = { type: "strong", children: [result] };
    else if (mark.type === "italic") result = { type: "em", children: [result] };
    else if (mark.type === "underline") result = { type: "u", children: [result] };
    else if (mark.type === "strike") result = { type: "s", children: [result] };
    else if (mark.type === "link") {
      result = { type: "link", href: String(mark.attrs?.href ?? ""), children: [result] };
    }
  }
  return result;
}

function pmInlineContent(nodes: PMNode[] | undefined): InlineNode[] {
  const out: InlineNode[] = [];
  for (const node of nodes ?? []) {
    if (node.type === "text") out.push(pmTextToInline(node));
    else if (node.type === "hardBreak") out.push({ type: "br" });
  }
  return out;
}

/** Conteúdo inline de um listItem: junta os parágrafos internos com <br>. */
function pmListItemContent(item: PMNode, extraItems: InlineNode[][]): InlineNode[] {
  const out: InlineNode[] = [];
  for (const child of item.content ?? []) {
    if (child.type === "paragraph") {
      if (out.length) out.push({ type: "br" });
      out.push(...pmInlineContent(child.content));
    } else if (child.type === "bulletList" || child.type === "orderedList") {
      // Lista aninhada (Tab no editor): achata como itens irmãos.
      for (const nested of child.content ?? []) {
        extraItems.push(pmListItemContent(nested, extraItems));
      }
    }
  }
  return out;
}

export function docToMarkdown(doc: PMNode): string {
  const blocks: BlockNode[] = [];

  for (const node of doc?.content ?? []) {
    if (node.type === "paragraph") {
      const children = pmInlineContent(node.content);
      if (children.length) blocks.push({ type: "paragraph", children });
    } else if (node.type === "heading") {
      const level = node.attrs?.level === 2 ? 2 : 3;
      blocks.push({ type: "heading", level, children: pmInlineContent(node.content) });
    } else if (node.type === "bulletList" || node.type === "orderedList") {
      const items: InlineNode[][] = [];
      for (const item of node.content ?? []) {
        const extra: InlineNode[][] = [];
        items.push(pmListItemContent(item, extra));
        items.push(...extra);
      }
      const filtered = items.filter((item) => serializeMarkdownInlineNotEmpty(item));
      if (filtered.length) {
        blocks.push({ type: "list", ordered: node.type === "orderedList", items: filtered });
      }
    }
  }

  return serializeMarkdown(blocks);
}

function serializeMarkdownInlineNotEmpty(nodes: InlineNode[]): boolean {
  return nodes.some((n) => (n.type === "text" ? n.text.trim().length > 0 : n.type !== "br"));
}
