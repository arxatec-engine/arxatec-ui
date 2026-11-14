import { cn } from "@/utilities/class";

import type { FilePublicPreviewRenderProps } from "./types";
import { PublicPreviewMedia } from "./components/media";
import {
  FileImageViewer,
  FileOfficeViewer,
  FilePdfViewer,
} from "./constants/lazy_viewers";
import { FileMimeRouter } from "../mime_router";
import { FileUnknownViewer } from "../unknown_viewer";
import { getFilePreviewMimeType } from "../../utilities/preview_mime_type";
import { resolveWordDocumentFormat } from "../../utilities/word_document_format";
import { resolveSpreadsheetFormat } from "../../utilities/spreadsheet_format";
import { resolvePresentationFormat } from "../../utilities/presentation_format";

export const FilePublicPreviewRender = ({
  fileName,
  nativeDocumentMimeType,
  mimeType,
  objectUrl,
  signedUrl,
  onDownload,
  convertToDocx,
  convertToXlsx,
  className,
}: FilePublicPreviewRenderProps) => {
  const resolvedMimeType = getFilePreviewMimeType(fileName, mimeType);
  const previewUrl = objectUrl ?? signedUrl;
  const wordFormat = resolveWordDocumentFormat(fileName, resolvedMimeType);
  const officeUrl =
    resolvePresentationFormat(fileName, resolvedMimeType) ||
    resolveSpreadsheetFormat(fileName, resolvedMimeType) ||
    wordFormat === "docx" ||
    (wordFormat && convertToDocx)
      ? previewUrl
      : signedUrl;
  const hasPreviewUrl = Boolean(previewUrl);
  const publicFileKey = `${fileName}-${previewUrl ?? "preview"}`;
  return (
    <div
      data-slot="file-public-preview-render"
      className={cn("relative h-full min-h-0 w-full", className)}
    >
      <FileMimeRouter
        mimeType={resolvedMimeType}
        fileName={fileName}
        nativeDocumentMimeType={nativeDocumentMimeType}
        renderNativeDocument={
          <FileUnknownViewer
            fileName={fileName}
            isPending={false}
            isError={!hasPreviewUrl}
            onDownload={onDownload}
          />
        }
        renderPdf={
          previewUrl ? (
            <FilePdfViewer
              url={previewUrl}
              fileName={fileName}
              onDownload={onDownload}
            />
          ) : (
            <FileUnknownViewer
              fileName={fileName}
              isPending={false}
              isError
              onDownload={onDownload}
            />
          )
        }
        renderImage={
          <FileImageViewer
            url={previewUrl ?? undefined}
            mimeType={resolvedMimeType}
            fileId={publicFileKey}
            isPending={false}
            isError={!hasPreviewUrl}
            onDownload={onDownload}
          />
        }
        renderOffice={
          officeUrl ? (
            <FileOfficeViewer
              url={officeUrl}
              fileName={fileName}
              mimeType={resolvedMimeType}
              isPending={false}
              isError={false}
              onDownload={onDownload}
              convertToDocx={convertToDocx}
              convertToXlsx={convertToXlsx}
            />
          ) : (
            <FileUnknownViewer
              fileName={fileName}
              isPending={false}
              isError
              onDownload={onDownload}
            />
          )
        }
        renderVideo={
          previewUrl ? (
            <PublicPreviewMedia
              kind="video"
              url={previewUrl}
              fileName={fileName}
            />
          ) : (
            <FileUnknownViewer
              fileName={fileName}
              isError
              onDownload={onDownload}
            />
          )
        }
        renderAudio={
          previewUrl ? (
            <PublicPreviewMedia
              kind="audio"
              url={previewUrl}
              fileName={fileName}
            />
          ) : (
            <FileUnknownViewer
              fileName={fileName}
              isError
              onDownload={onDownload}
            />
          )
        }
        renderSource={
          <FileUnknownViewer
            fileName={fileName}
            isPending={false}
            isError={!hasPreviewUrl}
            onDownload={onDownload}
          />
        }
        renderUnknown={
          <FileUnknownViewer
            fileName={fileName}
            isPending={false}
            isError={!hasPreviewUrl}
            onDownload={onDownload}
          />
        }
      />
    </div>
  );
};

export type { FilePublicPreviewRenderProps } from "./types";
