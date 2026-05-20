function escapeHtmlText(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function plainToAnnotationHtml(text: string): string {
  const lines = text.replace(/\r/g, "").split("\n");
  if (lines.length === 0) return "<p><br></p>";
  return lines.map((line) => `<p>${line.length ? escapeHtmlText(line) : "<br>"}</p>`).join("");
}

const PRUNABLE_INLINE_TAGS = new Set([
  "STRONG",
  "B",
  "EM",
  "I",
  "U",
  "S",
  "SPAN",
  "MARK",
  "STRIKE",
  "DEL",
  "CODE",
  "SUB",
  "SUP",
]);

function pruneEmptyInlineNodes(p: HTMLElement): void {
  for (let round = 0; round < 32; round++) {
    let any = false;
    const all = Array.from(p.querySelectorAll("*")).reverse();
    for (const el of all) {
      if (el === p || el.tagName === "BR") continue;
      if (!PRUNABLE_INLINE_TAGS.has(el.tagName)) continue;
      const h = el as HTMLElement;
      if (h.querySelector("br")) continue;
      const t = (h.textContent ?? "").replace(/\u200b/g, "").trim();
      if (t === "") {
        h.remove();
        any = true;
      }
    }
    if (!any) break;
  }
}

function replaceParagraphTextPreservingMarks(p: HTMLElement, paragraphText: string): void {
  const doc = p.ownerDocument!;
  const lines = paragraphText.split("\n");

  const textNodes: Text[] = [];
  const tw = doc.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  let cur: Node | null;
  while ((cur = tw.nextNode())) {
    textNodes.push(cur as Text);
  }

  if (textNodes.length === 0) {
    p.replaceChildren();
    lines.forEach((line, i) => {
      if (i > 0) p.appendChild(doc.createElement("br"));
      p.appendChild(doc.createTextNode(line));
    });
    return;
  }

  for (let i = 1; i < textNodes.length; i++) {
    textNodes[i]!.nodeValue = "";
  }

  const primary = textNodes[0]!;
  primary.nodeValue = lines[0] ?? "";

  if (lines.length <= 1) {
    pruneEmptyInlineNodes(p);
    return;
  }

  let insertAfter: Node = primary;
  for (let li = 1; li < lines.length; li++) {
    const br = doc.createElement("br");
    const parent = insertAfter.parentNode;
    if (!parent) break;
    parent.insertBefore(br, insertAfter.nextSibling);
    const tn = doc.createTextNode(lines[li] ?? "");
    parent.insertBefore(tn, br.nextSibling);
    insertAfter = tn;
  }

  pruneEmptyInlineNodes(p);
}

export function mergePlainDraftIntoAnnotationHtml(
  previousHtml: string,
  plainDraft: string,
): string {
  const trimmed = previousHtml.trim();
  const normalizedDraft = plainDraft.replace(/\r/g, "");
  if (!trimmed) {
    return plainToAnnotationHtml(normalizedDraft);
  }

  const doc = new DOMParser().parseFromString(
    `<div id="ann-merge-root">${trimmed}</div>`,
    "text/html",
  );
  const root = doc.getElementById("ann-merge-root");
  if (!root) {
    return plainToAnnotationHtml(normalizedDraft);
  }

  const pEls = Array.from(root.querySelectorAll<HTMLParagraphElement>(":scope > p"));
  const paragraphs = normalizedDraft.split(/\n\n+/);

  if (pEls.length === 0) {
    return plainToAnnotationHtml(normalizedDraft);
  }

  if (pEls.length === 1 && paragraphs.length === 1) {
    replaceParagraphTextPreservingMarks(pEls[0]!, paragraphs[0]!);
    return root.innerHTML;
  }

  if (pEls.length === paragraphs.length) {
    for (let i = 0; i < pEls.length; i++) {
      replaceParagraphTextPreservingMarks(pEls[i]!, paragraphs[i]!);
    }
    return root.innerHTML;
  }

  if (pEls.length === 1 && paragraphs.length > 1) {
    const snapshot = pEls[0]!.cloneNode(true) as HTMLElement;
    replaceParagraphTextPreservingMarks(pEls[0]!, paragraphs[0]!);
    for (let i = 1; i < paragraphs.length; i++) {
      const clone = snapshot.cloneNode(true) as HTMLElement;
      replaceParagraphTextPreservingMarks(clone, paragraphs[i]!);
      root.appendChild(clone);
    }
    return root.innerHTML;
  }

  if (pEls.length > 1 && paragraphs.length === 1) {
    replaceParagraphTextPreservingMarks(pEls[0]!, paragraphs[0]!);
    for (let i = 1; i < pEls.length; i++) {
      pEls[i]!.remove();
    }
    return root.innerHTML;
  }

  return plainToAnnotationHtml(normalizedDraft);
}
