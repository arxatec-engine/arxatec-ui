import "@cyntler/react-doc-viewer/dist/index.css";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useRef } from "react";
import { resolveOfficeFileExtension } from "../../../../utilities/resolve_file_view_kind";
import { useFileViewLoadingChange } from "../../../../hooks";
import { useOfficeEmbedOverlay } from "../../hooks";
import type { FileOfficeViewerProps } from "../../types";
import { FileOfficeViewerToolbar } from "../toolbar";

const FileOfficeViewerContent = ({
  url,
  fileName,
  mimeType,
  onDownload,
  onLoadingChange,
}: Omit<FileOfficeViewerProps, "isPending" | "isError">) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const isEmbedPending = useOfficeEmbedOverlay(rootRef, url);
  useFileViewLoadingChange(isEmbedPending, onLoadingChange);
  const fileType = resolveOfficeFileExtension(fileName, mimeType);
  const docs = [{ uri: url, fileType }];

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-0 h-full w-full flex-col bg-background"
    >
      <div className="h-full flex-1 overflow-hidden">
        <DocViewer
          documents={docs}
          prefetchMethod="GET"
          language="es"
          pluginRenderers={DocViewerRenderers}
          config={{
            loadingRenderer: {
              overrideComponent: () => null,
              showLoadingTimeout: false,
            },
            header: {
              disableHeader: true,
              disableFileName: true,
              retainURLParams: true,
            },
          }}
          theme={{
            primary: "#fff",
            secondary: "#ffffff",
            tertiary: "#fff",
            textPrimary: "#ffffff",
            textSecondary: "#fff",
            textTertiary: "#fff",
            disableThemeScrollbar: false,
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <FileOfficeViewerToolbar onDownload={onDownload} />
    </div>
  );
};

export { FileOfficeViewerContent };
