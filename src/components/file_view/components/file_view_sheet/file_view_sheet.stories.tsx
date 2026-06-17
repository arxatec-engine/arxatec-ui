import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FileText, Mic, Sparkles, Pencil } from "lucide-react";

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
