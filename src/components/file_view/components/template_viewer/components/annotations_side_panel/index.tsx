import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { ScrollArea } from "@/components/scroll_area";
import { StatusMessage } from "@/components/status_message";
import { Textarea } from "@/components/text_area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Layers, Pencil, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { cn } from "@/utilities/class";
import type {
  FileAnnotation,
  TemplateAnnotation,
} from "../../../../types/annotations";
import { isTextAnnotation } from "../../../../types/annotations";
import {
  displayLabelForAnnotation,
  mergePlainDraftIntoAnnotationHtml,
} from "../../utilities";

function plainPreviewFromHtml(html: string): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text || "Texto vacío";
}

function htmlToPlain(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<\/div>\s*<div>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

interface Props {
  annotations: TemplateAnnotation[];
  selectedId: string | null;
  onFocusAnnotation: (id: string) => void;
  onUpdateAnnotation: (next: FileAnnotation) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const AnnotationsSidePanel: React.FC<Props> = ({
  annotations: allAnnotations,
  selectedId,
  onFocusAnnotation,
  onUpdateAnnotation,
  onDelete,
  onClearAll,
}) => {
  const annotations = allAnnotations;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const effectiveEditingId =
    editingId !== null &&
    annotations.some((a) => a.id === editingId && isTextAnnotation(a)) &&
    selectedId === editingId
      ? editingId
      : null;

  const pagesGrouped = useMemo(() => {
    const orderIndex = (id: string) =>
      annotations.findIndex((x) => x.id === id);
    const byPage = new Map<number, TemplateAnnotation[]>();
    for (const a of annotations) {
      const arr = byPage.get(a.page) ?? [];
      arr.push(a);
      byPage.set(a.page, arr);
    }
    for (const arr of byPage.values()) {
      arr.sort((x, y) => orderIndex(x.id) - orderIndex(y.id));
    }
    return [...byPage.keys()]
      .sort((a, b) => a - b)
      .map((page) => ({
        page,
        items: byPage.get(page) ?? [],
      }));
  }, [annotations]);

  const startEdit = useCallback(
    (a: FileAnnotation) => {
      onFocusAnnotation(a.id);
      setEditingId(a.id);
      setEditDraft(htmlToPlain(a.content_html));
    },
    [onFocusAnnotation],
  );

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditDraft("");
  }, []);

  const commitEdit = useCallback(() => {
    if (!effectiveEditingId) return;
    const ann = annotations.find(
      (x): x is FileAnnotation =>
        x.id === effectiveEditingId && isTextAnnotation(x),
    );
    if (!ann) return;
    const content_html = mergePlainDraftIntoAnnotationHtml(
      ann.content_html,
      editDraft,
    );
    onFocusAnnotation(ann.id);
    onUpdateAnnotation({
      ...ann,
      content_html,
      label: plainPreviewFromHtml(content_html).slice(0, 500) || ann.label,
    });
    setEditingId(null);
    setEditDraft("");
  }, [
    annotations,
    effectiveEditingId,
    editDraft,
    onUpdateAnnotation,
    onFocusAnnotation,
  ]);

  const totalCount = annotations.length;
  const isEmpty = totalCount === 0;

  return (
    <aside className="flex h-full min-h-0 w-full max-w-[min(100%,340px)] shrink-0 flex-col border-l border-border bg-card">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <Layers className="size-4 shrink-0 text-muted-foreground" />
          <h2 className="truncate text-sm font-normal text-foreground">
            Bloques
          </h2>
          {totalCount > 0 ? (
            <Badge
              variant="secondary"
              className="h-5 px-1.5 text-[11px] font-medium tabular-nums"
            >
              {totalCount}
            </Badge>
          ) : null}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
              aria-label="Eliminar todos los bloques"
              disabled={isEmpty}
              onClick={onClearAll}
            >
              <Trash2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Eliminar todos los bloques</TooltipContent>
        </Tooltip>
      </div>

      {isEmpty ? (
        <div className="flex min-h-0 flex-1 items-center justify-center p-3">
          <StatusMessage
            color="white"
            size="sm"
            title="Sin bloques aún"
            description="Usa la barra superior para añadir texto o formas."
            classNameCard="w-full flex-col items-center text-center"
          />
        </div>
      ) : (
        <ScrollArea className="min-h-0 w-full flex-1">
          <div className="flex w-full min-w-0 flex-col gap-3 p-2">
            {pagesGrouped.map(({ page, items }) => (
              <section
                key={page}
                aria-labelledby={`ann-page-${page}`}
                className="flex flex-col gap-1.5"
              >
                <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-card/95 p-1 backdrop-blur-sm">
                  <h3
                    id={`ann-page-${page}`}
                    className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Página {page}
                  </h3>
                  <span className="text-[11px] tabular-nums text-muted-foreground/70">
                    {items.length}
                  </span>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {items.map((a) => {
                    const selected = selectedId === a.id;
                    const isText = isTextAnnotation(a);
                    const isEditing = isText && effectiveEditingId === a.id;
                    const preview = isText
                      ? plainPreviewFromHtml(a.content_html)
                      : displayLabelForAnnotation(a, annotations);
                    return (
                      <li key={a.id} className="min-w-0 overflow-hidden">
                        <div
                          className={cn(
                            "group min-w-0 overflow-hidden rounded-md border transition-colors",
                            isEditing
                              ? "border-border bg-background shadow-sm"
                              : selected
                                ? "border-primary/40 bg-primary/5"
                                : "border-transparent bg-muted/30 hover:bg-muted/50",
                          )}
                        >
                          {isEditing ? (
                            <div
                              className="flex min-w-0 flex-col gap-2 overflow-hidden p-2"
                              onPointerDown={(e) => e.stopPropagation()}
                            >
                              <Textarea
                                value={editDraft}
                                onChange={(e) => setEditDraft(e.target.value)}
                                className="ann-side-panel-textarea min-h-24 w-full min-w-0 max-w-full resize-none rounded-md border border-border bg-background px-2 py-1.5 text-sm shadow-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:ring-offset-0"
                                aria-label="Editar contenido del bloque"
                                autoFocus
                              />
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-7"
                                  onClick={cancelEdit}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  className="h-7"
                                  onClick={() => commitEdit()}
                                >
                                  Guardar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex min-w-0 items-start gap-1 overflow-hidden px-2 py-1.5">
                              <button
                                type="button"
                                className="flex min-w-0 flex-1 overflow-hidden text-left"
                                onClick={() => onFocusAnnotation(a.id)}
                                aria-label={`Seleccionar bloque: ${preview}`}
                              >
                                <span
                                  className={cn(
                                    "ann-side-panel-preview text-sm leading-snug",
                                    selected
                                      ? "text-foreground"
                                      : "text-foreground/90",
                                  )}
                                >
                                  {preview}
                                </span>
                              </button>
                              <div className="flex shrink-0 items-center gap-0.5 opacity-60 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                                {isText ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="size-7 text-muted-foreground hover:text-foreground"
                                        aria-label="Editar texto"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          startEdit(a);
                                        }}
                                      >
                                        <Pencil className="size-3.5" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Editar texto
                                    </TooltipContent>
                                  </Tooltip>
                                ) : null}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="size-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                      aria-label="Eliminar bloque"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(a.id);
                                      }}
                                    >
                                      <Trash2 className="size-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Eliminar bloque
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </ScrollArea>
      )}
    </aside>
  );
};
