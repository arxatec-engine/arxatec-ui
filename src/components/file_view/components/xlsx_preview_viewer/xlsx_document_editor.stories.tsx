import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/button";

import { FileXlsxDocumentEditor } from "./index";
import type { SpreadsheetEditorHandle } from "./types/editing";

const meta = {
  title: "FileView/XlsxDocumentEditor",
  component: FileXlsxDocumentEditor,
  args: { file: new File([], "Workbook.xlsx") },
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof FileXlsxDocumentEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

function EditableWorkbook() {
  const editorRef = useRef<SpreadsheetEditorHandle>(null);
  const [file, setFile] = useState<File>();
  const [revision, setRevision] = useState(0);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    void fetch(new URL("./fixtures/budget.xlsx", import.meta.url), {
      signal: controller.signal,
    })
      .then((response) => response.blob())
      .then((blob) => {
        if (!controller.signal.aborted)
          setFile(new File([blob], "Presupuesto.xlsx"));
      });
    return () => controller.abort();
  }, []);
  const save = async () => {
    if (!editorRef.current) return;
    setSaving(true);
    try {
      const bytes = await editorRef.current.save();
      setFile(new File([bytes], "Presupuesto.xlsx"));
      setNotice("Libro guardado y abierto de nuevo");
    } catch {
      setNotice("No se pudo guardar el libro");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <div className="flex shrink-0 items-center gap-3 border-b p-2">
        <Button
          disabled={!ready || !revision || saving}
          onClick={() => void save()}
        >
          Guardar en memoria
        </Button>
        <span role="status">{notice}</span>
      </div>
      {file && (
        <FileXlsxDocumentEditor
          ref={editorRef}
          file={file}
          onReady={setReady}
          onChange={setRevision}
        />
      )}
    </div>
  );
}

export const BasicWorkbook: Story = { render: () => <EditableWorkbook /> };
export const UnsupportedWorkbook: Story = {
  args: { file: new File(["invalid"], "Libro.xlsx") },
};
