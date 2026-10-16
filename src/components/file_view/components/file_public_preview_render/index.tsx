import type { ComponentProps } from "react";
import { FileMimeRouter } from "../mime_router";
import { FileUnknownViewer } from "../unknown_viewer";
import { lazyFileViewer } from "../lazy_viewer";
const FileImageViewer = lazyFileViewer<
  ComponentProps<typeof import("../image_viewer").FileImageViewer>
>(() =>
  import("../image_viewer").then((module) => ({
    default: module.FileImageViewer,
  })),
);
const FileOfficeViewer = lazyFileViewer<
  ComponentProps<typeof import("../office_viewer").FileOfficeViewer>
>(() =>
  import("../office_viewer").then((module) => ({
    default: module.FileOfficeViewer,
  })),
);
const FilePdfViewer = lazyFileViewer<
  ComponentProps<typeof import("../pdf_viewer").FilePdfViewer>
>(() =>
  import("../pdf_viewer").then((module) => ({ default: module.FilePdfViewer })),
);
import { getFilePreviewMimeType } from "../../utilities/preview_mime_type";

export interface FilePublicPreviewRenderProps {
  fileName: string;
  nativeDocumentMimeType?: string;
  mimeType?: string | null;
  objectUrl: string | null;
  signedUrl: string | null;
  onDownload?: () => void;
}

export const FilePublicPreviewRender = ({
  fileName,
  nativeDocumentMimeType,
  mimeType,
  objectUrl,
  signedUrl,
  onDownload,
}: FilePublicPreviewRenderProps) => {
  const resolvedMimeType = getFilePreviewMimeType(fileName, mimeType);
  const previewUrl = objectUrl ?? signedUrl;
  const hasPreviewUrl = Boolean(previewUrl);
  const publicFileKey = `${fileName}-${previewUrl ?? "preview"}`;

  return (
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
        signedUrl ? (
          <FileOfficeViewer
            url={signedUrl}
            fileName={fileName}
            mimeType={resolvedMimeType}
            isPending={false}
            isError={false}
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
      renderVideo={
        previewUrl ? (
          <div className="flex h-full w-full items-center justify-center bg-background p-6">
            <video
              src={previewUrl}
              controls
              className="max-h-full max-w-full rounded-md"
            />
          </div>
        ) : (
          <FileUnknownViewer
            fileName={fileName}
            isPending={false}
            isError
            onDownload={onDownload}
          />
        )
      }
      renderAudio={
        previewUrl ? (
          <div className="flex h-full w-full items-center justify-center bg-background p-6">
            <div className="w-full max-w-xl rounded-xl border border-border bg-card p-6">
              <p className="mb-4 truncate text-sm font-normal text-foreground">
                {fileName}
              </p>

              <audio src={previewUrl} controls className="w-full" />
            </div>
          </div>
        ) : (
          <FileUnknownViewer
            fileName={fileName}
            isPending={false}
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
  );
};
