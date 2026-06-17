import { Button } from "@/components/button";
import {
  ItalicToolbar,
  UnderlineToolbar,
  ColorHighlightToolbar,
} from "@/components/rich_text_editor/toolbars";
import { AnnotationBoldToolbar } from "./annotation_format_toolbars";
import { ToolbarProvider } from "@/components/rich_text_editor/toolbars/toolbar_provider";
import { TooltipProvider } from "@/components/tooltip";
import { Trash2 } from "lucide-react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useActiveAnnotationEditor } from "../../context/use_active_annotation_editor";
import {
  AnnotationBoxFontFamilyToolbar,
  AnnotationBoxFontSizeToolbar,
} from "./annotation_box_font_toolbars";

interface Props {
  selectedId: string | null;
  onDelete: () => void;
  canDelete: boolean;
}

export const AnnotationDockedToolbar: React.FC<Props> = ({
  selectedId,
  onDelete,
  canDelete,
}) => {
  const { active } = useActiveAnnotationEditor();
  const editor = selectedId && active?.id === selectedId ? active.editor : null;

  if (!editor) return null;

  return (
    <div
      className="flex min-w-0 items-center"
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      <ToolbarProvider editor={editor}>
        <TooltipProvider>
          <div className="tiptap-floating-toolbar flex min-w-0 items-center gap-0.5 p-1">
            <AnnotationBoldToolbar />
            <ItalicToolbar />
            <UnderlineToolbar />
            <AnnotationBoxFontFamilyToolbar />
            <AnnotationBoxFontSizeToolbar />
            <ColorHighlightToolbar />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label="Eliminar texto"
              disabled={!canDelete}
              onMouseDown={(ev: ReactMouseEvent) => {
                ev.preventDefault();
                ev.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </TooltipProvider>
      </ToolbarProvider>
    </div>
  );
};
