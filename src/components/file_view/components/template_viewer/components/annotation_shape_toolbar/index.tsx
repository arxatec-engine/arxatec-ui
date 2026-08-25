import { Button } from "@/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { Separator } from "@/components/separator";
import { Trash2 } from "lucide-react";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { TemplateAnnotation } from "../../../../types/annotations";
import {
  isEllipseAnnotation,
  isRectAnnotation,
} from "../../../../types/annotations";
import {
  type KonvaShapeAnnotation,
      nearestStrokePresetValue,
  STROKE_WIDTH_PRESETS,
  normalizeTemplateAnnotation
} from "../../utilities";
import { AnnotationColorPicker } from "../annotation_color_picker";
import { applyFillColor, applyStrokeColor, fillPickerValue, strokePickerValue } from "./utilities";

interface Props {
  annotation: KonvaShapeAnnotation;
  onUpdate: (next: TemplateAnnotation) => void;
  onDelete: () => void;
  disabled?: boolean;
}

export const AnnotationShapeToolbar = ({
  annotation,
  onUpdate,
  onDelete,
  disabled = false,
}: Props) => {
  const strokeW = nearestStrokePresetValue(
    annotation.strokeWidth ?? STROKE_WIDTH_PRESETS[1].value,
  );
  const showFill =
    isRectAnnotation(annotation) || isEllipseAnnotation(annotation);

  const patch = (partial: Record<string, unknown>) =>
    onUpdate(
      normalizeTemplateAnnotation({
        ...annotation,
        ...partial,
      } as KonvaShapeAnnotation),
    );

  return (
    <div
      className="flex flex-wrap items-center gap-1"
      onMouseDown={(e: ReactMouseEvent) => e.preventDefault()}
    >
      <AnnotationColorPicker
        label="Borde"
        tooltip="Color de borde"
        value={strokePickerValue(annotation)}
        disabled={disabled}
        onChange={(color) =>
          onUpdate(
            normalizeTemplateAnnotation(applyStrokeColor(annotation, color)),
          )
        }
      />

      {showFill ? (
        <AnnotationColorPicker
          label="Relleno"
          tooltip="Color de relleno"
          value={fillPickerValue(annotation)}
          disabled={disabled}
          onChange={(color) =>
            onUpdate(
              normalizeTemplateAnnotation(applyFillColor(annotation, color)),
            )
          }
        />
      ) : null}

      <Select
        value={String(strokeW)}
        disabled={disabled}
        onValueChange={(v) => patch({ strokeWidth: Number(v) })}
      >
        <SelectTrigger className="h-8 w-[72px] text-xs" aria-label="Grosor">
          <SelectValue placeholder="Grosor" />
        </SelectTrigger>
        <SelectContent>
          {STROKE_WIDTH_PRESETS.map((p) => (
            <SelectItem key={p.label} value={String(p.value)}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="mx-0.5 h-5 bg-border/80" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
        aria-label="Eliminar forma"
        disabled={disabled}
        onMouseDown={(ev: ReactMouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
};
