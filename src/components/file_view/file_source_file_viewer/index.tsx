import { useEffect, useState } from "react";
import { FileSourceViewer } from "../source_viewer";
import { effectiveMimeFromFile } from "../utilities/effective_mime_from_file";
import { getFilePreviewKey } from "../utilities/file_preview_key";

export interface FileSourceFileViewerProps {
  file: File;
}

const FileSourceFileViewerContent: React.FC<FileSourceFileViewerProps> = ({
  file,
}) => {
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

export const FileSourceFileViewer: React.FC<FileSourceFileViewerProps> = ({
  file,
}) => <FileSourceFileViewerContent key={getFilePreviewKey(file)} file={file} />;
