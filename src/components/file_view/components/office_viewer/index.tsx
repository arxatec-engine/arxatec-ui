import { FileViewErrorState } from "../error_state";
import { useState } from "react";
import type { ComponentProps } from "react";
import { useFileViewLoadingChange } from "../../hooks";
import { getFileNameFromUrl } from "../../utilities/get_extension_from_url";
import { resolveWordDocumentFormat } from "../../utilities/word_document_format";
import { lazyFileViewer } from "../lazy_viewer";
import { FileOfficeViewerContent } from "./components/file_office_viewer_content";
import type { FileOfficeViewerProps } from "./types";

const FileDocxPreviewViewer = lazyFileViewer<
  ComponentProps<typeof import("../docx_preview_viewer").FileDocxPreviewViewer>
>(() =>
  import("../docx_preview_viewer").then((module) => ({
    default: module.FileDocxPreviewViewer,
  })),
);

export const FileOfficeViewer = (props: FileOfficeViewerProps) => {
  const name =
    props.fileName || (props.url ? getFileNameFromUrl(props.url) : undefined);
  const format = resolveWordDocumentFormat(name, props.mimeType);
  if (format === "docx" || (format && props.convertToDocx)) {
    return <FileDocxPreviewViewer {...props} fileName={name} />;
  }
  return <FileOfficeEmbedViewer key={props.url} {...props} />;
};

const FileOfficeEmbedViewer = ({
  url,
  fileName,
  mimeType,
  isPending = false,
  isError = false,
  onDownload,
  onLoadingChange,
}: FileOfficeViewerProps) => {
  const [isContentLoading, setIsContentLoading] = useState(true);
  useFileViewLoadingChange(
    !isError && (isPending || (Boolean(url) && isContentLoading)),
    onLoadingChange,
  );

  if (isPending) {
    return null;
  }

  if (isError || !url) return <FileViewErrorState />;

  return (
    <FileOfficeViewerContent
      key={url}
      url={url}
      fileName={fileName}
      mimeType={mimeType}
      onDownload={onDownload}
      onLoadingChange={setIsContentLoading}
    />
  );
};

export type { FileOfficeViewerProps } from "./types";
