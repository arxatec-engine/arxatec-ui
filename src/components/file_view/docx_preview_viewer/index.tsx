import { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import { FileX } from "lucide-react";
import { Skeleton } from "@/components/skeleton";
import { StatusMessage } from "@/components/status_message";
import { getFilePreviewKey } from "../utilities/file_preview_key";

export interface FileDocxPreviewViewerProps {
  file: File;
}

const FileDocxPreviewViewerContent: React.FC<FileDocxPreviewViewerProps> = ({
  file,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="relative w-full h-full overflow-auto bg-accent">
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
      <div ref={containerRef} className="w-full min-h-full p-4" />
    </div>
  );
};

export const FileDocxPreviewViewer: React.FC<FileDocxPreviewViewerProps> = ({
  file,
}) => (
  <FileDocxPreviewViewerContent key={getFilePreviewKey(file)} file={file} />
);
