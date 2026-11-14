import { useTextFile } from "../../hooks/use_text_file";
import { FileSourceViewer } from "../../../source_viewer";
import { effectiveMimeFromFile } from "../../../../utilities/effective_mime_from_file";
import type { FileSourceFileViewerProps } from "../../types";

const FileSourceFileViewerContent = ({
  file,
  className,
  onLoadingChange,
  ...props
}: FileSourceFileViewerProps) => {
  const { content, loading, error } = useTextFile(file);

  return (
    <FileSourceViewer
      className={className}
      content={content}
      mimeType={effectiveMimeFromFile(file)}
      fileName={file.name}
      isPending={loading}
      isError={error}
      onLoadingChange={onLoadingChange}
      {...props}
    />
  );
};

export { FileSourceFileViewerContent };
