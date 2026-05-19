import { Button } from "@/components/button";
import { FloatingToolbar } from "@/components/rich_text_editor/extensions/floating_toolbar";
import { Trash2 } from "lucide-react";
import type {
  ComponentProps,
  ComponentType,
  MouseEvent as ReactMouseEvent,
} from "react";
import { useActiveAnnotationEditor } from "../../context/use_active_annotation_editor";

type FloatingToolbarEditor = NonNullable<
  ComponentProps<typeof FloatingToolbar>["editor"]
>;

const DockedFloatingToolbar = FloatingToolbar as ComponentType<
  ComponentProps<typeof FloatingToolbar>
>;

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
    <DockedFloatingToolbar
      editor={editor as unknown as FloatingToolbarEditor}
      compact
      presentation="dock"
      panelClassName="rounded-none border-0 bg-transparent shadow-none max-w-none"
      extraActions={
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
      }
    />
  );
};
