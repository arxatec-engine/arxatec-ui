import "@cyntler/react-doc-viewer/dist/index.css";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { FileOfficeViewerToolbar } from "./components/toolbar";
import { FileViewErrorState, FileViewLoadingState } from "../shared";
import { resolveOfficeFileExtension } from "../mime_router/resolve_file_view_kind";

export interface FileOfficeViewerProps {
  url: string;
  fileName?: string;
  mimeType?: string;
  isPending?: boolean;
  isError?: boolean;
  onDownload?: () => void;
}

const FileOfficeViewerContent: React.FC<
  Omit<FileOfficeViewerProps, "isPending" | "isError">
> = ({ url, fileName, mimeType, onDownload }) => {
  const fileType = resolveOfficeFileExtension(fileName, mimeType);
  const docs = [{ uri: url, fileType }];

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <FileOfficeViewerToolbar onDownload={onDownload} />
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
    </div>
  );
};

export const FileOfficeViewer: React.FC<FileOfficeViewerProps> = ({
  url,
  fileName,
  mimeType,
  isPending = false,
  isError = false,
  onDownload,
}) => {
  if (isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <FileViewLoadingState />
      </div>
    );
  }

  if (isError || !url) return <FileViewErrorState />;

  return (
    <FileOfficeViewerContent
      key={url}
      url={url}
      fileName={fileName}
      mimeType={mimeType}
      onDownload={onDownload}
    />
  );
};
