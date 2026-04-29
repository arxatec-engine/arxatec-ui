import { cn, content } from "@/utilities";
import {
  ImageExtension,
  ImagePlaceholder,
  TipTapFloatingMenu,
  FloatingToolbar,
} from "./extensions";
import SearchAndReplace from "./extensions/search_and_replace";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
  EditorContent,
  type Extension,
  useEditor,
  type Editor,
} from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { EditorToolbar } from "./toolbars";
import Placeholder from "@tiptap/extension-placeholder";
import { Loader2, Save, ChevronDown, FileDown, Sparkles } from "lucide-react";
import { Button } from "@/components/button";
import { toast } from "sonner";
// import { AiCommandModal } from "./components/ai_modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown_menu";

const extensions = [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal",
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: "list-disc",
      },
    },
    heading: {
      levels: [1, 2, 3, 4],
    },
  }),
  Placeholder.configure({
    emptyNodeClass: "is-editor-empty",
    placeholder: ({ node }) => {
      switch (node.type.name) {
        case "heading":
          return `Encabezado ${node.attrs.level}`;
        case "detailsSummary":
          return "Título de sección";
        case "codeBlock":
          // never show the placeholder when editing code
          return "";
        default:
          return "Escribe algo, escribe '/' para comandos";
      }
    },
    includeChildren: false,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  TextStyle,
  Subscript,
  Superscript,
  Underline,
  Link,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  ImageExtension,
  ImagePlaceholder,
  SearchAndReplace,
  Typography,
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
];

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
    ref,
  ) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLocalSaving, setIsLocalSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    // AI Modals and states commented out as requested
    // const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    // const [isAiLoading, setIsAiLoading] = useState(false);
    // const abortControllerRef = useRef<AbortController | null>(null);

    const editor = useEditor({
      immediatelyRender: false,
      extensions: extensions as Extension[],
      content: initialContent || content,
      editorProps: {
        attributes: {
          class: "max-w-full focus:outline-none",
        },
      },
    });

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
        toast.success("Documento guardado");
        onSaveSuccess?.();
      } catch {
        toast.error("Error al guardar");
      } finally {
        setIsLocalSaving(false);
      }
    };

    return (
      <div
        className={cn(
          "relative flex flex-col h-full w-full overflow-hidden bg-background",
          className,
        )}
      >
        <EditorToolbar
          editor={editor}
          isExpanded={isExpanded}
          documentName={documentName}
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
                      Guardar cambios
                    </DropdownMenuItem>
                    {(onExportPdf || onExportWord) && (
                      <>
                        <div className="h-px bg-muted my-1" />
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          Exportar como
                        </div>
                        {onExportPdf && (
                          <DropdownMenuItem onClick={onExportPdf}>
                            <FileDown className="w-4 h-4 mr-2" />
                            PDF (.pdf)
                          </DropdownMenuItem>
                        )}
                        {onExportWord && (
                          <DropdownMenuItem onClick={onExportWord}>
                            <FileDown className="w-4 h-4 mr-2" />
                            Word (.docx)
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
            !isExpanded ? "bg-muted/30 p-4 md:p-8" : "bg-card",
          )}
        >
          <div
            className={cn(
              "mx-auto transition-all duration-300 ease-in-out relative",
              !isExpanded
                ? "max-w-212.5 bg-card rounded-md border min-h-275 mb-10"
                : "max-w-262.5 w-full",
            )}
          >
            <FloatingToolbar editor={editor} />
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
                !isExpanded ? "p-8 md:p-12 lg:p-16" : "p-8 md:p-10 is-expanded",
              )}
              onMouseDown={() => {
                if (!editor.isFocused) editor.chain().focus().run();
              }}
            />
            {onOpenChatbot && (
              <div className="absolute bottom-6 right-6 z-10 hidden sm:block">
                <Button
                  onClick={onOpenChatbot}
                  className="rounded-full h-12 w-12 shadow-xl border-2 border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <Sparkles className="size-6" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
