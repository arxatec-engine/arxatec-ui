import { useCallback, type ComponentProps, type RefObject } from "react";
import type { Document } from "react-pdf";

import type { DocumentOutlineItem } from "../../../../../document_outline";

type PdfDocument = Parameters<
  NonNullable<ComponentProps<typeof Document>["onLoadSuccess"]>
>[0];
type PdfOutline = NonNullable<Awaited<ReturnType<PdfDocument["getOutline"]>>>;

export const usePdfOutline = (
  viewportRef: RefObject<HTMLDivElement | null>,
  onOutline?: (items: DocumentOutlineItem[]) => void,
) => useCallback((pdf: PdfDocument) => {
  void (async () => {
    const outline = await pdf.getOutline();
    const items: DocumentOutlineItem[] = [];
    const visit = async (entries: PdfOutline, level: number): Promise<void> => {
      for (const entry of entries) {
        try {
          const dest = typeof entry.dest === "string"
            ? await pdf.getDestination(entry.dest)
            : entry.dest;
          if (dest && dest[0] != null) {
            const page = typeof dest[0] === "number"
              ? dest[0] + 1
              : (await pdf.getPageIndex(dest[0])) + 1;
            const pdfPage = await pdf.getPage(page);
            const pageViewport = pdfPage.getViewport({ scale: 1 });
            const destinationType = dest[1]?.name;
            const top = destinationType === "XYZ"
              ? dest[3]
              : destinationType === "FitH" || destinationType === "FitBH"
                ? dest[2]
                : destinationType === "FitR"
                  ? dest[5]
                  : null;
            const y = typeof top === "number"
              ? Math.max(0, Math.min(1,
                  pageViewport.convertToViewportPoint(0, top)[1] / pageViewport.height,
                ))
              : 0;
            const position = () => {
              const viewport = viewportRef.current;
              const element = viewport?.querySelector<HTMLElement>(`[data-page="${page}"]`);
              if (!viewport || !element) return null;
              return element.getBoundingClientRect().top -
                viewport.getBoundingClientRect().top + element.clientHeight * y;
            };
            items.push({
              title: entry.title,
              level,
              position,
              navigate: () => {
                const viewport = viewportRef.current;
                const offset = position();
                if (viewport && offset !== null)
                  viewport.scrollTo({ top: viewport.scrollTop + offset, behavior: "smooth" });
              },
            });
          }
        } catch {
          // Invalid destinations should not hide the rest of the outline.
        }
        await visit(entry.items, level + 1);
      }
    };
    if (outline) await visit(outline, 0);
    const firstLevel = items.length ? Math.min(...items.map((item) => item.level)) : 0;
    return items.map((item) => ({ ...item, level: item.level - firstLevel }));
  })().then((items) => onOutline?.(items)).catch(() => onOutline?.([]));
}, [viewportRef, onOutline]);
