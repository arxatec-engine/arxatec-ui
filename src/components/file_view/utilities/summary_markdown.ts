import { Marked, type Tokens } from "marked";

/**
 * Los resúmenes los genera un modelo, así que llegan indistintamente como
 * texto plano o como Markdown (GFM). Se renderizan siempre con Markdown: el
 * texto plano sobrevive intacto y el Markdown deja de mostrarse en crudo.
 *
 * El HTML resultante se inyecta con `dangerouslySetInnerHTML`, por lo que este
 * renderer nunca emite HTML que venga del contenido: las etiquetas embebidas se
 * escapan y se muestran como texto, y los enlaces/imágenes con protocolos no
 * permitidos (`javascript:`, `data:`…) pierden el atributo.
 */
const ALLOWED_PROTOCOLS = ["http:", "https:", "mailto:", "tel:"];

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Devuelve `null` cuando la URL no es segura para inyectar en el DOM. */
const safeUrl = (href: string): string | null => {
  const trimmed = href.trim();
  if (!trimmed) return null;
  // Rutas relativas y anclas: no llevan protocolo.
  if (/^[#/?]/.test(trimmed)) return trimmed;
  try {
    const { protocol } = new URL(trimmed, "https://arxatec.invalid");
    return ALLOWED_PROTOCOLS.includes(protocol) ? trimmed : null;
  } catch {
    return null;
  }
};

const titleAttribute = (title?: string | null): string =>
  title ? ` title="${escapeHtml(title)}"` : "";

/** Instancia propia para no contaminar la configuración global de `marked`. */
const summaryMarked = new Marked({
  async: false,
  gfm: true,
  breaks: true,
}).use({
  renderer: {
    html({ text }: Tokens.HTML | Tokens.Tag) {
      return escapeHtml(text);
    },
    link(token: Tokens.Link) {
      const text = this.parser.parseInline(token.tokens);
      const href = safeUrl(token.href ?? "");
      if (!href) return text;
      return `<a href="${escapeHtml(href)}"${titleAttribute(token.title)} target="_blank" rel="noopener noreferrer">${text}</a>`;
    },
    image(token: Tokens.Image) {
      const alt = escapeHtml(token.text ?? "");
      const src = safeUrl(token.href ?? "");
      if (!src) return alt;
      return `<img src="${escapeHtml(src)}" alt="${alt}"${titleAttribute(token.title)} />`;
    },
  },
});

/** Convierte el resumen a HTML listo para pintar dentro de un contenedor `.prose`. */
export const summaryMarkdownToHtml = (content?: string | null): string => {
  if (!content || !content.trim()) return "";
  return summaryMarked.parse(content, { async: false }) as string;
};
