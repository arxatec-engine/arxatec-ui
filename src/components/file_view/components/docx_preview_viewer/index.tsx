import { useCallback, useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import { FileX } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/skeleton";
import { StatusMessage } from "@/components/status_message";
import { getFilePreviewKey } from "../../utilities/file_preview_key";
import { Toolbar } from "./components/toolbar";

export interface FileDocxPreviewViewerProps {
  file: File;
}

const FileDocxPreviewViewerContent: React.FC<FileDocxPreviewViewerProps> = ({
  file,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  const handleZoomIn = useCallback(
    () => setScale((prev) => Math.min(prev + 0.2, 3.0)),
    [],
  );

  const handleZoomOut = useCallback(
    () => setScale((prev) => Math.max(prev - 0.2, 0.5)),
    [],
  );

  const handleDownload = useCallback(() => {
    try {
      const blobUrl = window.URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.name || "documento.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (downloadError) {
      console.error(downloadError);
      toast.error("Error al descargar el documento");
    }
  }, [file]);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    let cancelled = false;
    el.innerHTML = "";

    file
      .arrayBuffer()
      .then((buffer) =>
        renderAsync(buffer, el, undefined, {
          className: "docx-preview-container",
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreFonts: false,
          breakPages: true,
          useBase64URL: true,
        }),
      )
      .then(() => {
        if (!cancelled) setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoading(false);
          setError(
            err instanceof Error
              ? err.message
              : "Error al renderizar el documento",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [file]);

  return (
    <div className="relative w-full h-full bg-accent">
      <div className="w-full h-full overflow-auto">
        {loading && (
          <div className="absolute inset-0 z-10 flex min-h-0 p-4">
            <Skeleton className="h-full w-full min-h-full" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-10 flex min-h-0 bg-background p-4">
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
        )}
        <div
          ref={containerRef}
          className="w-full min-h-full p-4 transition-transform duration-200"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        />
      </div>
      {!error && (
        <Toolbar
          scale={scale}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onDownload={handleDownload}
          disabled={loading}
        />
      )}
    </div>
  );
};

export const FileDocxPreviewViewer: React.FC<FileDocxPreviewViewerProps> = ({
  file,
}) => (
  <FileDocxPreviewViewerContent key={getFilePreviewKey(file)} file={file} />
);
