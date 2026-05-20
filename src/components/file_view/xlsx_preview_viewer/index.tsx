import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FileX, TableProperties } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/scroll_area";
import { Skeleton } from "@/components/skeleton";
import { StatusMessage } from "@/components/status_message";
import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import { cn } from "@/utilities/class";
import { getFilePreviewKey } from "../utilities/file_preview_key";

interface SheetData {
  name: string;
  rows: string[][];
}

export interface FileXlsxPreviewViewerProps {
  file: File;
}

const LoadingState = () => (
  <div className="p-4 h-full w-full">
    <Skeleton className="w-full h-full" />
  </div>
);

const FileXlsxPreviewViewerContent: React.FC<FileXlsxPreviewViewerProps> = ({
  file,
}) => {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    file
      .arrayBuffer()
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const parsed: SheetData[] = workbook.SheetNames.map((name) => {
          const ws = workbook.Sheets[name];
          const rows: string[][] = XLSX.utils.sheet_to_json(ws, {
            header: 1,
            defval: "",
          }) as string[][];
          return { name, rows };
        });
        if (!cancelled) {
          setSheets(parsed);
          setActiveSheet(0);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLoading(false);
          setError(
            err instanceof Error ? err.message : "Error al leer el archivo",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [file]);

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <div className="p-4 h-full w-full">
        <StatusMessage
          title="Error al renderizar el documento"
          description={error}
          icon={FileX}
          classNameCard="h-full w-full flex-col items-center justify-center"
          classNameIconCard="mx-auto"
          classNameDescription="text-center w-full max-w-sm"
          classNameTitle="text-center w-full"
          color="rose"
        />
      </div>
    );
  }

  const current = sheets[activeSheet];
  const [header, ...dataRows] = current?.rows ?? [];
  const colCount = header?.length ?? 0;
  const rowCount = dataRows.length;

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {current && current.rows.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-1.5 border-b bg-muted/20 shrink-0">
          <TableProperties className="size-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {rowCount} {rowCount === 1 ? "fila" : "filas"} · {colCount}{" "}
            {colCount === 1 ? "columna" : "columnas"}
          </span>
        </div>
      )}

      {current && current.rows.length > 0 ? (
        <ScrollArea className="flex-1 min-h-0">
          <table className="text-xs border-collapse min-w-full w-max">
            <thead>
              <tr className="sticky top-0 z-10 bg-muted">
                <th className="border border-border p-2 text-muted-foreground font-normal w-10 text-center select-none" />
                {header.map((cell, ci) => (
                  <th
                    key={ci}
                    className="border border-border px-3 py-2 text-left font-semibold text-foreground whitespace-nowrap max-w-[240px] truncate"
                    title={String(cell)}
                  >
                    {String(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => (
                <tr
                  key={ri}
                  className={
                    ri % 2 === 0
                      ? "bg-background hover:bg-accent/50 transition-colors"
                      : "bg-muted/20 hover:bg-accent/50 transition-colors"
                  }
                >
                  <td className="border border-border px-2 py-1.5 text-center text-muted-foreground select-none w-10">
                    {ri + 1}
                  </td>
                  {Array.from({ length: colCount }).map((_, ci) => (
                    <td
                      key={ci}
                      className="border border-border px-3 py-1.5 whitespace-nowrap max-w-[240px] truncate text-foreground"
                      title={String(row[ci] ?? "")}
                    >
                      {String(row[ci] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <StatusMessage
            title="Hoja vacía"
            description="Esta hoja no contiene datos."
            icon={TableProperties}
          />
        </div>
      )}

      {sheets.length > 1 && (
        <div className="px-3 py-2 border-t bg-background shrink-0">
          <Tabs>
            <TabsList className="bg-accent">
              {sheets.map((sheet, i) => (
                <TabsTrigger
                  key={sheet.name}
                  value={sheet.name}
                  onClick={() => setActiveSheet(i)}
                  className={cn(i === activeSheet && "bg-background")}
                >
                  {sheet.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export const FileXlsxPreviewViewer: React.FC<FileXlsxPreviewViewerProps> = ({
  file,
}) => (
  <FileXlsxPreviewViewerContent key={getFilePreviewKey(file)} file={file} />
);
