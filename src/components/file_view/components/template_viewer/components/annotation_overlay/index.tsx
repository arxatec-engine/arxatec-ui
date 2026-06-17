import type { FileAnnotation } from "../../../../types/annotations";
import { useCallback, useState } from "react";
import { AnnotationItem } from "../annotation_item";

interface Props {
  pageNumber: number;
  pdfScale: number;
  annotations: FileAnnotation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onChange: (next: FileAnnotation) => void;
  getPageRect: () => DOMRect | null;
  moveableLayoutKey: string;
  hidden?: boolean;
  allowPagePointerEvents?: boolean;
}

export const AnnotationOverlay: React.FC<Props> = ({
  pageNumber,
  pdfScale,
  annotations,
  selectedId,
  onSelect,
  onChange,
  getPageRect,
  moveableLayoutKey,
  hidden = false,
  allowPagePointerEvents = false,
}) => {
  const list = annotations.filter((a) => a.page === pageNumber);
  const [moveableContainer, setMoveableContainer] =
    useState<HTMLDivElement | null>(null);
  const containerRef = useCallback((el: HTMLDivElement | null) => {
    setMoveableContainer(el);
  }, []);

  if (list.length === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        visibility: hidden ? "hidden" : "visible",
        pointerEvents: hidden || allowPagePointerEvents ? "none" : undefined,
      }}
    >
      <div
        ref={containerRef}
        className="pointer-events-none relative h-full w-full"
      >
        {list.map((ann) => (
          <AnnotationItem
            key={ann.id}
            annotation={ann}
            pdfScale={pdfScale}
            isSelected={selectedId === ann.id}
            onSelect={() => onSelect(ann.id)}
            onChange={onChange}
            getPageRect={getPageRect}
            moveableContainer={moveableContainer}
            moveableLayoutKey={moveableLayoutKey}
          />
        ))}
      </div>
    </div>
  );
};
