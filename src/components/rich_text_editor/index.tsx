import { cn } from "@/utilities/index";
import {
  ImageExtension,
  ImagePlaceholder,
  TipTapFloatingMenu,
  FloatingToolbar,
} from "@/components/rich_text_editor/extensions/";
import SearchAndReplace from "@/components/rich_text_editor/extensions/search_and_replace";
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
import { EditorContent, type Extension, useEditor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { EditorToolbar } from "./toolbars";
import Placeholder from "@tiptap/extension-placeholder";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/button";
import { content } from "@/utilities";
import { toast } from "sonner";

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
];

export interface RichTextEditorRef {
  save: () => Promise<void>;
  isDirty: boolean;
  fileId: string | undefined;
}

export const RichTextEditor = forwardRef<
  RichTextEditorRef,
  {
    className?: string;
    fileId?: string;
    /** Si se define, el botón "Guardar" persistirá el documento vía este callback. */
    onSave?: (schema: JSONContent) => Promise<void>;
    onSaveSuccess?: () => void;
  }
>(({ className, fileId, onSave, onSaveSuccess }, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLocalSaving, setIsLocalSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: extensions as Extension[],
    content,
    editorProps: {
      attributes: {
        class: "max-w-full focus:outline-none",
      },
    },
  });

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
        className
      )}
    >
      <EditorToolbar
        editor={editor}
        isExpanded={isExpanded}
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
          !isExpanded ? "bg-muted/30 p-4 md:p-8" : "bg-card"
        )}
      >
        <div
          className={cn(
            "mx-auto transition-all duration-300 ease-in-out relative",
            !isExpanded
              ? "max-w-212.5 bg-card rounded-md border min-h-275 mb-10"
              : "max-w-262.5 w-full"
          )}
        >
          <FloatingToolbar editor={editor} />
          <TipTapFloatingMenu editor={editor} />
          <EditorContent
            editor={editor}
            className={cn(
              "cursor-text transition-all duration-300",
              !isExpanded ? "p-8 md:p-12 lg:p-16" : "p-8 md:p-10 is-expanded"
            )}
            onMouseDown={() => {
              if (!editor.isFocused) editor.chain().focus().run();
            }}
          />
        </div>
      </div>
    </div>
  );
});
