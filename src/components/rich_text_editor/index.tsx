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
import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
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
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/button";
import { toast } from "sonner";
import { AiCommandModal } from "./components/ai_modal";

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
    onAiCommand?: (
      payload: { prompt: string; content: string },
      onChunk: (chunk: string) => void,
    ) => Promise<void>;
  }
>(
  (
    {
      className,
      fileId,
      initialContent,
      onSave,
      onSaveSuccess,
      onAiCommand,
      documentName,
    },
    ref,
  ) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLocalSaving, setIsLocalSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const editor = useEditor({
      immediatelyRender: false,
      extensions: extensions as Extension[],
      content: initialContent || content,
      editorProps: {
        attributes: {
          class: "max-w-full focus:outline-none",
        },
        // @ts-expect-error - Custom property used by extensions
        onOpenAiModal: () => setIsAiModalOpen(true),
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

    const handleAiCommand = async (
      prompt: string,
      selectionContent: string,
    ) => {
      if (!onAiCommand || !editor) {
        toast.error("Servicio de IA no disponible para este editor.");
        return;
      }

      setIsAiLoading(true);
      abortControllerRef.current = new AbortController();

      try {
        const { from, to } = editor.state.selection;
        let hasStartedTyping = false;

        await onAiCommand({ prompt, content: selectionContent }, (chunk) => {
          if (!hasStartedTyping) {
            editor.chain().focus().deleteRange({ from, to }).run();
            hasStartedTyping = true;
          }
          editor.chain().focus().insertContent(chunk).run();
        });

        toast.success("Edición completada");
        setIsAiModalOpen(false);
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        if (error.name === "AbortError") {
          toast.info("Generación cancelada");
        } else {
          toast.error("Error al procesar con IA");
          console.error(err);
        }
      } finally {
        setIsAiLoading(false);
        abortControllerRef.current = null;
      }
    };

    const handleCancelAi = () => {
      abortControllerRef.current?.abort();
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
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isLocalSaving}
                className="ml-2 gap-2"
              >
                {isLocalSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isLocalSaving ? "Guardando..." : "Guardar"}
              </Button>
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
            <FloatingToolbar
              editor={editor}
              onOpenAiModal={() => setIsAiModalOpen(true)}
            />
            <TipTapFloatingMenu editor={editor} />
            <AiCommandModal
              editor={editor}
              isOpen={isAiModalOpen}
              onClose={() => setIsAiModalOpen(false)}
              onCommand={handleAiCommand}
              isLoading={isAiLoading}
              onCancel={handleCancelAi}
            />
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
          </div>
        </div>
      </div>
    );
  },
);
