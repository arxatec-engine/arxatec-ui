import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link2, Upload } from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { cn } from "@/utilities/class";
import { inferMimeFromFileName } from "../utilities/infer_mime_from_file_name";

export interface FilePreviewSource {
  url: string;
  file: File | null;
  fileName: string;
  mimeType: string;
}

export interface FilePreviewPlaygroundProps {
  /** Acepta tipos de archivo para el input local (ej. "image/*,application/pdf"). */
  accept?: string;
  /** URL precargada para arrancar mostrando algo. */
  defaultUrl?: string;
  /**
   * Si es true, en modo URL se descarga el recurso a un `File` real
   * (necesario para visores que reciben `File`, como docx/xlsx/código).
   */
  requireFile?: boolean;
  /** Texto de ayuda mostrado bajo los controles. */
  hint?: ReactNode;
  /** Render del visor con la fuente seleccionada. */
  children: (source: FilePreviewSource) => ReactNode;
}

type Mode = "file" | "url";

const resolveMime = (fileName: string, fallback?: string) =>
  fallback && fallback.length > 0
    ? fallback
    : (inferMimeFromFileName(fileName) ?? "application/octet-stream");

const fileNameFromUrl = (url: string) => {
  try {
    const { pathname } = new URL(url, window.location.href);
    const last = pathname.split("/").filter(Boolean).pop();
    return last ? decodeURIComponent(last) : "archivo";
  } catch {
    return "archivo";
  }
};

export const FilePreviewPlayground: React.FC<FilePreviewPlaygroundProps> = ({
  accept,
  defaultUrl,
  requireFile = false,
  hint,
  children,
}) => {
  const [mode, setMode] = useState<Mode>(defaultUrl ? "url" : "file");
  const [urlInput, setUrlInput] = useState(defaultUrl ?? "");
  const [source, setSource] = useState<FilePreviewSource | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const revokeObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  useEffect(() => () => revokeObjectUrl(), []);

  useEffect(() => {
    if (defaultUrl && !requireFile) {
      setSource({
        url: defaultUrl,
        file: null,
        fileName: fileNameFromUrl(defaultUrl),
        mimeType: resolveMime(fileNameFromUrl(defaultUrl)),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    revokeObjectUrl();
    setError(null);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setSource({
      url,
      file,
      fileName: file.name,
      mimeType: resolveMime(file.name, file.type),
    });
  };

  const handleUrl = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setError(null);
    const fileName = fileNameFromUrl(trimmed);

    if (!requireFile) {
      revokeObjectUrl();
      setSource({
        url: trimmed,
        file: null,
        fileName,
        mimeType: resolveMime(fileName),
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(trimmed);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const file = new File([blob], fileName, {
        type: blob.type || resolveMime(fileName),
      });
      revokeObjectUrl();
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setSource({
        url,
        file,
        fileName,
        mimeType: resolveMime(fileName, file.type),
      });
    } catch (err) {
      setError(
        `No se pudo descargar la URL (¿CORS o ruta inválida?): ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div className="flex flex-col gap-3 border-b border-border bg-card p-3">
        <div className="inline-flex w-fit rounded-md border border-border p-0.5">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 text-sm transition-colors",
              mode === "file"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Upload className="size-4" />
            Archivo local
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 text-sm transition-colors",
              mode === "url"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Link2 className="size-4" />
            URL
          </button>
        </div>

        {mode === "file" ? (
          <input
            type="file"
            accept={accept}
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
          />
        ) : (
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void handleUrl();
            }}
          >
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://ejemplo.com/archivo.pdf"
              type="url"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Cargando…" : "Mostrar"}
            </Button>
          </form>
        )}

        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : hint ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {source ? (
          children(source)
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
            Selecciona un archivo local o introduce una URL para previsualizar.
          </div>
        )}
      </div>
    </div>
  );
};
