import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FileText, Mic, Sparkles, Pencil } from "lucide-react";

import { FileViewLoadingState } from "../loading_state";
import { FileViewSheet, FILE_VIEW_SHEET_TAB } from "./index";

const meta = {
  title: "FileView/FileViewSheet",
  component: FileViewSheet,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Panel lateral (sheet) con pestañas para original, transcripción, resumen, plantilla y edición.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    open: false,
    onOpenChange: () => {},
    fileKey: "demo-file",
    title: "documento.pdf",
    renderOriginal: null,
  },
  argTypes: {
    onOpenChange: { table: { disable: true } },
  },
} satisfies Meta<typeof FileViewSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

function SheetDemo() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <button
        type="button"
        className="m-4 rounded-md border border-border px-3 py-1.5 text-sm"
        onClick={() => setOpen(true)}
      >
        Abrir sheet
      </button>
      <FileViewSheet
        open={open}
        onOpenChange={setOpen}
        fileKey="demo-file"
        title="contrato-servicios.pdf"
        showTabs
        defaultTab={FILE_VIEW_SHEET_TAB.ORIGINAL}
        tabs={[
          {
            id: FILE_VIEW_SHEET_TAB.ORIGINAL,
            label: "Original",
            icon: <FileText className="size-4" />,
          },
          {
            id: FILE_VIEW_SHEET_TAB.TRANSCRIPTION,
            label: "Transcripción",
            icon: <Mic className="size-4" />,
          },
          {
            id: FILE_VIEW_SHEET_TAB.SUMMARY,
            label: "Resumen",
            icon: <Sparkles className="size-4" />,
          },
          {
            id: FILE_VIEW_SHEET_TAB.EDIT,
            label: "Editar",
            icon: <Pencil className="size-4" />,
          },
        ]}
        renderOriginal={
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Contenido original
          </div>
        }
        renderTranscription={
          <div className="p-6 text-sm">Transcripción de ejemplo…</div>
        }
        renderSummary={<div className="p-6 text-sm">Resumen de ejemplo…</div>}
        renderEdit={
          <div className="p-6 text-sm">Editor de documento (slot)…</div>
        }
      />
    </>
  );
}

export const ConTabs: Story = {
  render: () => <SheetDemo />,
};

function LazyPanelsDemo() {
  const [open, setOpen] = useState(true);
  const [file, setFile] = useState(1);
  const [active, setActive] = useState<string>(FILE_VIEW_SHEET_TAB.ORIGINAL);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir panel diferido
      </button>
      <FileViewSheet
        open={open}
        onOpenChange={setOpen}
        lazyPanels
        fileKey={`lazy-${file}`}
        title={`Archivo ${file}`}
        showTabs
        onActiveTabChange={setActive}
        tabs={[
          { id: FILE_VIEW_SHEET_TAB.ORIGINAL, label: "Original" },
          { id: FILE_VIEW_SHEET_TAB.SUMMARY, label: "Resumen" },
          { id: FILE_VIEW_SHEET_TAB.EDIT, label: "Editar" },
        ]}
        renderOriginal={
          <div className="p-6">
            <p>Panel inicial</p>
            <p>Activo: {active}</p>
            <button type="button" onClick={() => setFile((value) => value + 1)}>
              Cambiar archivo
            </button>
          </div>
        }
        renderSummary={(isActive) => (
          <div className="p-6" data-testid="lazy-summary">
            Resumen montado; consulta {isActive ? "activa" : "pausada"}
          </div>
        )}
        renderEdit={
          <div className="p-6">
            <label htmlFor="lazy-editor">Edición conservada</label>
            <input
              id="lazy-editor"
              data-testid="lazy-editor"
              defaultValue="Texto inicial"
            />
          </div>
        }
      />
    </>
  );
}

export const PanelesDiferidos: Story = {
  render: () => <LazyPanelsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Solo monta Original al abrir. Visita Editar, cambia el texto y vuelve: se conserva. Cambiar archivo o cerrar reinicia los paneles. Resumen pausa la consulta mientras está oculto.",
      },
    },
  },
};

export const Cargando: Story = {
  render: () => (
    <FileViewSheet
      open
      onOpenChange={() => {}}
      fileKey="loading-demo"
      title="contrato-servicios.pdf"
      isPending
      loadingOverlay={<FileViewLoadingState />}
      renderOriginal={null}
    />
  ),
};
