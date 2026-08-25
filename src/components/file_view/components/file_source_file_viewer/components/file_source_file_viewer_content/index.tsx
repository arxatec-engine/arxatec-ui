import { useEffect, useState } from "react";
import { FileSourceViewer } from "../../../source_viewer";
import { effectiveMimeFromFile } from "../../../../utilities/effective_mime_from_file";
import type { FileSourceFileViewerProps } from "../../types";

const FileSourceFileViewerContent = ({
  file,
}: FileSourceFileViewerProps) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    file
      .text()
      .then((text) => {
        if (!cancelled) {
          setContent(text);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
          setError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [file]);

  return (
    <FileSourceViewer
      content={content}
      mimeType={effectiveMimeFromFile(file)}
      fileName={file.name}
      isPending={loading}
      isError={error}
    />
  );
};

export { FileSourceFileViewerContent };
