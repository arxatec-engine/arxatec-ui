import { cn, content } from "@/utilities";
import {
  TipTapFloatingMenu,
  FloatingToolbar,
  BlockDragHandle,
} from "./extensions";
import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import {
  EditorContent,
  Extension,
  useEditor,
  type Editor,
  type JSONContent,
} from "@tiptap/react";
import * as Y from "yjs";
import { EditorToolbar } from "./toolbars";
import { createRichTextEditorExtensions } from "./lib/editor_extensions";
import { Loader2, Save, ChevronDown, FileDown } from "lucide-react";
import { Button } from "@/components/button";
import { toast } from "sonner";
// import { AiCommandModal } from "./components/ai_modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown_menu";

export type { Editor, JSONContent };

export interface RichTextEditorRef {
  editor: Editor | null;
  save: () => Promise<void>;
  isDirty: boolean;
  fileId: string | undefined;
}

export const RichTextEditor = forwardRef<
  RichTextEditorRef,
  {
    className?: string;
    fileId?: string;
    initialContent?: JSONContent;
    /** Si se define, el botón "Guardar" persistirá el documento vía este callback. */
    onSave?: (schema: JSONContent) => Promise<void>;
    onSaveSuccess?: () => void;
    documentName?: string;
    onExportPdf?: () => void;
    onExportWord?: () => void;
    onOpenChatbot?: () => void;
  }
>(
  (
    {
      className,
      fileId,
      initialContent,
      onSave,
      onSaveSuccess,
      documentName,
      onExportPdf,
      onExportWord,
      onOpenChatbot,
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLocalSaving, setIsLocalSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    // AI Modals and states commented out as requested
    // const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    // const [isAiLoading, setIsAiLoading] = useState(false);
    // const abortControllerRef = useRef<AbortController | null>(null);

    const ydoc = useMemo(() => new Y.Doc(), []);
    const editorExtensions = useMemo(
      () => createRichTextEditorExtensions(ydoc) as Extension[],
      [ydoc],
    );

    const editor = useEditor(
      {
        immediatelyRender: false,
        extensions: editorExtensions,
        content: initialContent || content,
        editorProps: {
          attributes: {
            class: "max-w-full focus:outline-none",
          },
        },
      },
      [editorExtensions],
    );

    useEffect(() => {
      if (editor && initialContent) {
        const currentJSONStr = JSON.stringify(editor.getJSON());
        const initialContentStr = JSON.stringify(initialContent);

        if (currentJSONStr !== initialContentStr) {
          editor.commands.setContent(initialContent);
          setIsDirty(false);
        }
      }
    }, [initialContent, editor]);

    useEffect(() => {
      if (!editor) return;

      const handleUpdate = () => setIsDirty(true);
      editor.on("update", handleUpdate);

      return () => {
        editor.off("update", handleUpdate);
      };
    }, [editor]);

    const handleSaveInternal = async () => {
      if (!editor || !onSave) return;
      await onSave(editor.getJSON());
      setIsDirty(false);
    };

    useImperativeHandle(ref, () => ({
      editor,
      save: handleSaveInternal,
      isDirty,
      fileId,
    }));

    if (!editor) return null;

    const handleSave = async () => {
      if (!onSave) {
        toast.error("No hay función de guardado configurada (onSave).");
        return;
      }

      setIsLocalSaving(true);
      try {
        await handleSaveInternal();
        onSaveSuccess?.();
      } catch {
        toast.error("No se pudo guardar el documento.");
      } finally {
        setIsLocalSaving(false);
      }
    };

    return (
      <div
        className={cn(
          "relative flex flex-col h-full w-full overflow-hidden bg-background",
          className
        )}
      >
        <EditorToolbar
          editor={editor}
          isExpanded={isExpanded}
          documentName={documentName}
          onOpenChatbot={onOpenChatbot}
          onToggleExpand={() => {
            setIsExpanded(!isExpanded);
            setTimeout(() => {
              editor?.chain().focus().run();
            }, 100);
          }}
          rightContent={
            onSave && (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isLocalSaving}
                      className="ml-2 gap-2"
                    >
                      {isLocalSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {isLocalSaving ? "Guardando..." : "Guardar"}
                      <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={handleSave}
                      disabled={isLocalSaving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </DropdownMenuItem>
                    {(onExportPdf || onExportWord) && (
                      <>
                        <div className="h-px bg-muted my-1" />
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          Guardar como
                        </div>
                        {onExportPdf && (
                          <DropdownMenuItem onClick={onExportPdf}>
                            <FileDown className="w-4 h-4 mr-2" />
                            PDF
                          </DropdownMenuItem>
                        )}
                        {onExportWord && (
                          <DropdownMenuItem onClick={onExportWord}>
                            <FileDown className="w-4 h-4 mr-2" />
                            Word
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )
          }
        />

        <div
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300 ease-in-out scroll-smooth",
            !isExpanded ? "bg-muted/30 p-2 sm:p-4" : "bg-card"
          )}
        >
          <div
            className={cn(
              "mx-auto transition-all duration-300 ease-in-out relative",
              !isExpanded
                ? "max-w-212.5 bg-card rounded-md border min-h-275 mb-4"
                : "max-w-262.5 w-full"
            )}
          >
            <FloatingToolbar editor={editor} />
            <BlockDragHandle editor={editor} />
            <TipTapFloatingMenu editor={editor} />
            {/* <AiCommandModal
              editor={editor}
              isOpen={isAiModalOpen}
              onClose={() => setIsAiModalOpen(false)}
              onCommand={handleAiCommand}
              isLoading={isAiLoading}
              onCancel={handleCancelAi}
            /> */}
            <EditorContent
              editor={editor}
              className={cn(
                "cursor-text transition-all duration-300 prose dark:prose-invert max-w-none",
                // Tipografía más compacta (solo este editor): cuerpo 0.8rem e interlineado ajustado
                "[&_.ProseMirror_p]:text-[0.8rem]! [&_.ProseMirror_p]:leading-[1.45]!",
                "[&_.ProseMirror>p]:my-[0.4rem]! [&_.ProseMirror_p]:my-[0.4rem]!",
                // Encabezados: menos hueco antes/después respecto al CSS global (.ProseMirror h1–h4)
                "[&_.ProseMirror_h1]:mt-6! [&_.ProseMirror_h1]:mb-2! [&_.ProseMirror_h1]:text-[1.75rem]! [&_.ProseMirror_h1]:leading-[1.2]!",
                "[&_.ProseMirror_h2]:mt-5! [&_.ProseMirror_h2]:mb-1.5! [&_.ProseMirror_h2]:text-[1.4rem]! [&_.ProseMirror_h2]:leading-tight!",
                "[&_.ProseMirror_h3]:mt-4! [&_.ProseMirror_h3]:mb-1! [&_.ProseMirror_h3]:text-[1.05rem]! [&_.ProseMirror_h3]:leading-[1.3]!",
                "[&_.ProseMirror_h4]:mt-3! [&_.ProseMirror_h4]:mb-1! [&_.ProseMirror_h4]:text-[0.875rem]! [&_.ProseMirror_h4]:leading-snug!",
                // Listas compactas (.prose li usa mb:fuerza mayor; OL list-inside = números al tamaño del texto)
                "[&_.ProseMirror_ul]:my-1! [&_.ProseMirror_ul]:list-outside! [&_.ProseMirror_ul]:pl-5!",
                "[&_.ProseMirror_ul_ul]:my-1! [&_.ProseMirror_ul_ul]:mt-1! [&_.ProseMirror_ul_ul]:pl-4!",
                "[&_.ProseMirror_ol]:my-1! [&_.ProseMirror_ol]:list-decimal! [&_.ProseMirror_ol]:list-inside! [&_.ProseMirror_ol]:pl-3!",
                "[&_.ProseMirror_ol_ol]:my-1! [&_.ProseMirror_ol_ol]:mt-1! [&_.ProseMirror_ol_ol]:pl-5.5!",
                "[&_.ProseMirror_li]:mb-[2px]! [&_.ProseMirror_li]:mt-0! [&_.ProseMirror_li]:pl-0! [&_.ProseMirror_li]:first:mt-0!",
                "[&_.ProseMirror_li:last-child]:mb-0!",
                "[&_.ProseMirror_li]:text-[0.8rem]! [&_.ProseMirror_li]:leading-[1.45]!",
                "[&_.ProseMirror_ul_li]:marker:text-muted-foreground!",
                "[&_.ProseMirror_li_p]:leading-[inherit]! [&_.ProseMirror_li_p]:my-0!",
                // Citas — tarjeta con acento lateral, sin cursiva forzada
                "[&_.ProseMirror_blockquote]:relative!",
                "[&_.ProseMirror_blockquote]:my-4! [&_.ProseMirror_blockquote]:rounded-lg! [&_.ProseMirror_blockquote]:border! [&_.ProseMirror_blockquote]:border-border!",
                "[&_.ProseMirror_blockquote]:border-l-4! [&_.ProseMirror_blockquote]:border-l-primary!",
                "[&_.ProseMirror_blockquote]:bg-muted/35! [&_.ProseMirror_blockquote]:px-4! [&_.ProseMirror_blockquote]:py-3!",
                "[&_.ProseMirror_blockquote]:shadow-sm! [&_.ProseMirror_blockquote]:not-italic! [&_.ProseMirror_blockquote]:text-[0.8rem]!",
                "[&_.ProseMirror_blockquote]:leading-[1.45]! [&_.ProseMirror_blockquote]:text-foreground!",
                "[&_.ProseMirror_blockquote_p]:leading-[inherit]!",
                // Bloque de código (Notion-like): superficie plana, sin sombras ni stripe lateral
                "[&_.ProseMirror_pre]:my-4! [&_.ProseMirror_pre]:overflow-x-auto! [&_.ProseMirror_pre]:rounded-[6px]!",
                "[&_.ProseMirror_pre]:border! [&_.ProseMirror_pre]:border-border/50! [&_.ProseMirror_pre]:bg-muted/65! dark:[&_.ProseMirror_pre]:bg-muted/40! dark:[&_.ProseMirror_pre]:border-border/40!",
                "[&_.ProseMirror_pre]:px-3.75! [&_.ProseMirror_pre]:py-2.75!",
                "[&_.ProseMirror_pre_code]:m-0! [&_.ProseMirror_pre_code]:rounded-none! [&_.ProseMirror_pre_code]:border-0! [&_.ProseMirror_pre_code]:bg-transparent!",
                "[&_.ProseMirror_pre_code]:font-mono! [&_.ProseMirror_pre_code]:text-[0.8rem]! [&_.ProseMirror_pre_code]:tabular-nums!",
                "[&_.ProseMirror_pre_code]:leading-[1.588]!",
                "[&_.ProseMirror_pre_code]:text-foreground!",
                // Tablas: tipografía alineada al cuerpo, bordes finos y celdas lisas sin “doble párrafo”
                "[&_.ProseMirror_.tableWrapper]:my-3! [&_.ProseMirror_.tableWrapper]:max-w-full",
                "[&_.ProseMirror_table]:w-full! [&_.ProseMirror_table]:my-0! [&_.ProseMirror_table]:border-collapse!",
                "[&_.ProseMirror_table]:text-[0.8rem]! [&_.ProseMirror_table]:rounded-lg! [&_.ProseMirror_table]:border! [&_.ProseMirror_table]:border-border! [&_.ProseMirror_table]:overflow-hidden!",
                "[&_.ProseMirror_th]:border-b! [&_.ProseMirror_th]:border-border! [&_.ProseMirror_th]:bg-muted/70! [&_.ProseMirror_th]:px-2.5! [&_.ProseMirror_th]:py-1.5! [&_.ProseMirror_th]:text-left! [&_.ProseMirror_th]:text-[0.7rem]! [&_.ProseMirror_th]:font-semibold! [&_.ProseMirror_th]:uppercase! [&_.ProseMirror_th]:tracking-wide! [&_.ProseMirror_th]:text-muted-foreground!",
                "[&_.ProseMirror_td]:border-border! [&_.ProseMirror_td]:border-r! [&_.ProseMirror_td]:border-b! [&_.ProseMirror_td]:px-2.5! [&_.ProseMirror_td]:py-1.5! [&_.ProseMirror_td]:align-top! [&_.ProseMirror_td]:text-[0.8rem]! [&_.ProseMirror_td]:leading-snug!",
                "[&_.ProseMirror_th:last-child]:border-r-0! [&_.ProseMirror_td:last-child]:border-r-0!",
                "[&_.ProseMirror_tr:last-child_td]:border-b-0!",
                "[&_.ProseMirror_td_p]:my-0! [&_.ProseMirror_td_p]:text-inherit!",
                "[&_.ProseMirror]:py-6! [&_.ProseMirror]:pr-3! [&_.ProseMirror]:pl-10! sm:[&_.ProseMirror]:px-5! sm:[&_.ProseMirror]:pl-12!",
                "[&_.ProseMirror_tbody_tr:nth-child(even)_td]:bg-muted/25!",
                !isExpanded ? "p-3 sm:p-5 md:p-6" : "p-3 sm:p-5 is-expanded"
              )}
              onMouseDown={() => {
                if (!editor.isFocused) editor.chain().focus().run();
              }}
            />
          </div>
        </div>
      </div>
    );
  }
);
