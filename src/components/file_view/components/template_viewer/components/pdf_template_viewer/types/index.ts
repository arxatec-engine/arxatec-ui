import type { RefObject } from "react";

import type {
  FileAnnotation,
  TemplateAnnotation,
} from "../../../../../types/annotations";
import type { ShapeDrawTool } from "../../../utilities";

export interface Props {
  documentKey: string;
  url: string;
  pageNumber: number;
  scale: number;
  pageWidthAtScale1?: number;
  pageHeightAtScale1?: number;
  annotations: TemplateAnnotation[];
  annotationAssetUrls: Record<string, string>;
  selectedId: string | null;
  shapeDrawTool: ShapeDrawTool | null;
  createShapeLabel: (kind: ShapeDrawTool) => string;
  onSelect: (id: string) => void;
  onClearSelection: () => void;
  onChangeTextAnnotation: (next: FileAnnotation) => void;
  onChangeShapeAnnotation: (next: TemplateAnnotation) => void;
  onShapeDrawToolChange: (tool: ShapeDrawTool | null) => void;
  onDocumentPagesLoaded?: (numPages: number) => void;
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
  onPageViewportAtScaleOne?: (width: number, height: number) => void;
}
