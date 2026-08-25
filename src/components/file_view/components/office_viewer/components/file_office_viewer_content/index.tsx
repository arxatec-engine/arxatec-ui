import "@cyntler/react-doc-viewer/dist/index.css";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { FileOfficeViewerToolbar } from "../toolbar";
import { resolveOfficeFileExtension } from "../../../../utilities/resolve_file_view_kind";
import type { FileOfficeViewerProps } from "../../types";

const FileOfficeViewerContent = ({ url, fileName, mimeType, onDownload }: Omit<FileOfficeViewerProps, "isPending" | "isError">) => {
  const fileType = resolveOfficeFileExtension(fileName, mimeType);
  const docs = [{ uri: url, fileType }];

  return (
    <div className="relative flex flex-col h-full w-full bg-background">
      <div className="flex-1 overflow-hidden h-full">
        <DocViewer
          documents={docs}
          prefetchMethod="GET"
          language="es"
          pluginRenderers={DocViewerRenderers}
          config={{
            loadingRenderer: {
              overrideComponent: () => <h5>Loading...</h5>,
              showLoadingTimeout: 1000,
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
