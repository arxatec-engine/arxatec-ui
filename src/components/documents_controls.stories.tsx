import type { Meta, StoryObj } from "@storybook/react-vite";

import { useState } from "react";

import { Download, FileText } from "lucide-react";

import { Button } from "./button";

import {
  ExplorerBreadcrumb,
  ExplorerFilters,
  ExplorerSelectionBar,
  ExplorerViewModeToggle,
  type ExplorerViewMode,
} from "./file_explorer";

import { ConfirmationDialog } from "./confirmation_dialog";

import { NameInputDialog } from "./name_input_dialog";

function ExplorerDemo() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<ExplorerViewMode>("grid");
  const [selected, setSelected] = useState(3);
  const [format, setFormat] = useState<string>();
  return (
    <main className="mx-auto max-w-4xl p-5 space-y-5">
      <ExplorerBreadcrumb
        items={[
          { id: null, name: "Archivos" },
          { id: "folder", name: "Contratos" },
        ]}
        onNavigate={() => setSearch("")}
      />
      <ExplorerSelectionBar
        count={selected}
        countLabel={selected + " seleccionados"}
        clearLabel="Limpiar selección"
        onClear={() => setSelected(0)}
        actions={[
          {
            key: "download",
            label: "Descargar",
            icon: Download,
            onClick: () => setSelected(0),
          },
        ]}
        trailing={
          <ExplorerViewModeToggle
            value={mode}
            onValueChange={setMode}
            labels={{ grid: "Cuadrícula", list: "Lista" }}
          />
        }
        filters={
          <ExplorerFilters
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar archivos…"
            formatFilter={{
              value: format,
              options: [
                {
                  value: "pdf",
                  label: "PDF",
                  icon: FileText,
                  mimeType: "application/pdf",
                },
              ],
              placeholder: "Formato",
              allLabel: "Todos",
              onChange: setFormat,
            }}
            trailing={
              <ExplorerViewModeToggle value={mode} onValueChange={setMode} />
            }
          />
        }
      />
      <Button variant="outline" onClick={() => setSelected(3)}>
        Seleccionar tres archivos
      </Button>
      <p className="text-sm text-muted-foreground">
        Vista: {mode} · Búsqueda: {search || "Todas"} · Formato:{" "}
        {format || "Todos"}
      </p>
    </main>
  );
}

function DialogDemo({ kind }: { kind: "name" | "confirmation" }) {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState("Contrato.pdf");
  const [result, setResult] = useState("");
  const finish = (message: string) => {
    setResult(message);
    setOpen(false);
  };
  return (
    <main className="p-6">
      <Button onClick={() => setOpen(true)}>Abrir diálogo</Button>
      <p role="status">{result}</p>
      {kind === "name" && (
        <NameInputDialog
          open={open}
          onOpenChange={setOpen}
          value={value}
          onValueChange={setValue}
          onConfirm={() => finish(value)}
          title="Cambiar nombre"
          description="Elige el nombre del archivo."
          inputLabel="Nombre"
          placeholder="Nombre del archivo"
          confirmLabel="Guardar"
          cancelLabel="Cancelar"
        />
      )}
      {kind === "confirmation" && (
        <ConfirmationDialog
          open={open}
          onOpenChange={setOpen}
          title="Eliminar archivo"
          description="Esta acción eliminará el archivo seleccionado."
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          confirmVariant="destructive"
          onConfirm={() => finish("Archivo eliminado")}
        />
      )}
    </main>
  );
}

const meta = {
  title: "Files/DocumentsControls",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Explorer: Story = { render: () => <ExplorerDemo /> };

export const NameDialog: Story = { render: () => <DialogDemo kind="name" /> };

export const Confirmation: Story = {
  render: () => <DialogDemo kind="confirmation" />,
};
