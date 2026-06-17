import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TEMPLATE_ANNOTATION_TYPES } from "../../types/annotations";
import type {
  EllipseAnnotation,
  LineAnnotation,
  RectAnnotation,
  TemplateAnnotation,
  TextAnnotation,
} from "../../types/annotations";
import { AnnotationToolbar } from "./components/annotation_toolbar";
import { AnnotationShapeToolbar } from "./components/annotation_shape_toolbar";
import { AnnotationsSidePanel } from "./components/annotations_side_panel";
import type { ShapeDrawTool } from "./utilities";

const SAMPLE_TEXT: TextAnnotation = {
  type: TEMPLATE_ANNOTATION_TYPES.TEXT,
  id: "00000000-0000-4000-8000-000000000001",
  page: 1,
  label: "Nuevo texto 1",
  x: 0.1,
  y: 0.1,
  width: 0.3,
  height: 0.08,
  content_html: "<p>Texto de prueba con <strong>negrita</strong>.</p>",
  font_family: "Arial, Helvetica, sans-serif",
  font_size: 16,
};

const SAMPLE_LONG_TEXT: TextAnnotation = {
  ...SAMPLE_TEXT,
  id: "00000000-0000-4000-8000-000000000002",
  label: "Nuevo texto 2",
  content_html:
    "<p>asdffffffffffffffffffffffffffffasdfasdfasdfasdfasdfasdfasdfasdfa</p>",
};

const SAMPLE_LINE: LineAnnotation = {
  type: TEMPLATE_ANNOTATION_TYPES.LINE,
  id: "00000000-0000-4000-8000-000000000003",
  page: 1,
  label: "Línea 1",
  x1: 0.1,
  y1: 0.25,
  x2: 0.5,
  y2: 0.35,
  stroke: "#2196F3",
  strokeWidth: 0.003,
};

const SAMPLE_RECT: RectAnnotation = {
  type: TEMPLATE_ANNOTATION_TYPES.RECT,
  id: "00000000-0000-4000-8000-000000000004",
  page: 1,
  label: "Rectángulo 1",
  x: 0.1,
  y: 0.45,
  width: 0.25,
  height: 0.12,
  stroke: "#F44336",
  strokeWidth: 0.002,
  fill: "#FFEB3B",
};

const SAMPLE_ELLIPSE: EllipseAnnotation = {
  type: TEMPLATE_ANNOTATION_TYPES.ELLIPSE,
  id: "00000000-0000-4000-8000-000000000005",
  page: 1,
  label: "Elipse 1",
  x: 0.45,
  y: 0.45,
  width: 0.2,
  height: 0.1,
  stroke: "#4CAF50",
  strokeWidth: 0.002,
  fill: null,
};

const SAMPLE_ANNOTATIONS: TemplateAnnotation[] = [
  SAMPLE_TEXT,
  SAMPLE_LONG_TEXT,
  SAMPLE_LINE,
  SAMPLE_RECT,
  SAMPLE_ELLIPSE,
];

const WYSIWYG_CHECKLIST = `
## Checklist manual (visor + export PDF)

### Texto
- [ ] Insertar caja, editar, negrita/subrayado, zoom 50% / 100% / 150%
- [ ] Resize manual: al recargar conserva ancho (size_mode manual)
- [ ] Export PDF: posición y texto alineados con pantalla

### Formas
- [ ] Línea / rect / elipse: dibujar, mover, resize, endpoints en líneas
- [ ] Borde transparente y relleno en rect/elipse
- [ ] Panel Bloques: etiquetas Línea 1, Rectángulo 1, etc.
- [ ] Texto + formas en misma página sin bloquear clics

### Export
- [ ] Guardar anotaciones → Guardar como PDF con todas las capas visibles
`;

const meta = {
  title: "FileView/TemplateViewer",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Componentes del visor de plantilla PDF (anotaciones).${WYSIWYG_CHECKLIST}`,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function SidePanelDemo() {
  const [annotations, setAnnotations] =
    useState<TemplateAnnotation[]>(SAMPLE_ANNOTATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(SAMPLE_RECT.id);

  return (
    <div className="flex h-[520px] w-full max-w-[380px] border border-border bg-background">
      <AnnotationsSidePanel
        annotations={annotations}
        selectedId={selectedId}
        onFocusAnnotation={setSelectedId}
        onUpdateAnnotation={(next) => {
          setAnnotations((prev) =>
            prev.map((a) => (a.id === next.id ? next : a)),
          );
        }}
        onDelete={(id) => {
          setAnnotations((prev) => prev.filter((a) => a.id !== id));
          setSelectedId((cur) => (cur === id ? null : cur));
        }}
        onClearAll={() => {
          setAnnotations([]);
          setSelectedId(null);
        }}
      />
    </div>
  );
}

export const PanelBloques: Story = {
  render: () => <SidePanelDemo />,
};

function ShapeToolbarDemo() {
  const [ann, setAnn] = useState<RectAnnotation>({ ...SAMPLE_RECT });

  return (
    <div className="rounded-md border border-border bg-card p-3">
      <AnnotationShapeToolbar
        annotation={ann}
        onUpdate={(next) => setAnn(next as RectAnnotation)}
        onDelete={() => undefined}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        stroke: {ann.stroke ?? "—"} · fill: {String(ann.fill)}
      </p>
    </div>
  );
}

export const ToolbarForma: Story = {
  render: () => <ShapeToolbarDemo />,
};

function MainToolbarDemo() {
  const [shapeDrawTool, setShapeDrawTool] = useState<ShapeDrawTool | null>(
    null,
  );
  const [selectedId, setSelectedId] = useState<string | null>(SAMPLE_RECT.id);

  return (
    <div className="w-full border-b border-border bg-card">
      <AnnotationToolbar
        shapeDrawTool={shapeDrawTool}
        onShapeDrawToolChange={setShapeDrawTool}
        onInsertText={() => undefined}
        onInsertImage={() => undefined}
        onSaveAsPdf={() => undefined}
        isExporting={false}
        isUploadingImage={false}
        hasAnnotations
        hasSelection={!!selectedId}
        activePdfPage={1}
        pdfPageCount={3}
        formatToolbar={
          selectedId === SAMPLE_RECT.id ? (
            <AnnotationShapeToolbar
              annotation={SAMPLE_RECT}
              onUpdate={() => undefined}
              onDelete={() => setSelectedId(null)}
            />
          ) : null
        }
      />
    </div>
  );
}

export const ToolbarPrincipal: Story = {
  render: () => <MainToolbarDemo />,
};
