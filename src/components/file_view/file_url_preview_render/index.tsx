import { FileImageViewer } from "../image_viewer";
import { FileOfficeViewer } from "../office_viewer";
import { FilePdfViewer } from "../pdf_viewer";
import { FileUnknownViewer } from "../unknown_viewer";
import { downloadFromUrl } from "../utilities/download_from_url";
import { getExtensionFromUrl } from "../utilities/get_extension_from_url";
import { inferMimeFromFileName } from "../utilities/infer_mime_from_file_name";

export interface FileUrlPreviewRenderProps {
  url: string;
  fileName: string;
}

const OFFICE_EXTENSIONS = ["doc", "docx", "ppt", "pptx", "xls", "xlsx"];
const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
  "bmp",
  "ico",
  "heic",
  "heif",
];

export const FileUrlPreviewRender: React.FC<FileUrlPreviewRenderProps> = ({
  url,
  fileName,
}) => {
  const ext = getExtensionFromUrl(url);
  const download = () => downloadFromUrl(url, fileName);

  if (ext === "pdf") {
    return (
      <FilePdfViewer url={url} fileName={fileName} onDownload={download} />
    );
  }

  if (IMAGE_EXTENSIONS.includes(ext)) {
    const mimeType = inferMimeFromFileName(fileName) ?? undefined;
    return (
      <FileImageViewer
        url={url}
        mimeType={mimeType}
        fileName={fileName}
        fileId={url}
        onDownload={download}
      />
    );
  }

  if (OFFICE_EXTENSIONS.includes(ext)) {
    return (
      <FileOfficeViewer
        url={url}
        fileName={fileName}
        mimeType={inferMimeFromFileName(fileName) ?? undefined}
        onDownload={download}
      />
    );
  }

  return <FileUnknownViewer fileName={fileName} onDownload={download} />;
};
