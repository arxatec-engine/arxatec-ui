import { FileCode } from "lucide-react";

import { cn } from "@/utilities/class";

import { getSourceLanguageFromFile } from "../../utilities/get_source_language_from_file";
import { useFileViewLoadingChange } from "../../hooks";
import { FileViewErrorState } from "../error_state";
import { SourceContent } from "./components/content";
import { SOURCE_VIEWER_LABELS } from "./constants";
import type { FileSourceViewerProps } from "./types";

export const FileSourceViewer = ({
  content,
  mimeType,
  fileName,
  isPending = false,
  isError = false,
  onLoadingChange,
  onDownload,
  labels: customLabels,
  className,
}: FileSourceViewerProps) => {
  const language = getSourceLanguageFromFile(mimeType, fileName);
  const labels = { ...SOURCE_VIEWER_LABELS, ...customLabels };
  useFileViewLoadingChange(isPending && !isError, onLoadingChange);

  if (isPending && !isError) {
    return null;
  }

  if (isError || content == null) {
    return (
      <div
        data-slot="file-source-viewer"
        className={cn("h-full", className)}
      >
        <FileViewErrorState
          title={labels.errorTitle}
          description={labels.errorDescription}
          icon={FileCode}
        />
      </div>
    );
  }

  return (
    <SourceContent
      key={`${mimeType}:${fileName}`}
      content={content}
      language={language}
      fileName={fileName}
      onDownload={onDownload}
      labels={labels}
      className={className}
    />
  );
};

export type { FileSourceViewerProps, FileSourceViewerLabels } from "./types";
