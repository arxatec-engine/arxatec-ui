import { FILE_VIEW_KIND, resolveFileViewKind } from "../../utilities/resolve_file_view_kind";

export interface FileMimeRouterProps {
  mimeType: string;
  fileName: string;
  nativeDocumentMimeType?: string;
  renderNativeDocument?: React.ReactNode;
  renderPdf?: React.ReactNode;
  renderImage?: React.ReactNode;
  renderVideo?: React.ReactNode;
  renderAudio?: React.ReactNode;
  renderOffice?: React.ReactNode;
  renderSource?: React.ReactNode;
  renderUnknown?: React.ReactNode;
}

export const FileMimeRouter: React.FC<FileMimeRouterProps> = ({
  mimeType,
  fileName,
  nativeDocumentMimeType,
  renderNativeDocument,
  renderPdf,
  renderImage,
  renderVideo,
  renderAudio,
  renderOffice,
  renderSource,
  renderUnknown,
}) => {
  const kind = resolveFileViewKind(mimeType, fileName, nativeDocumentMimeType);

  switch (kind) {
    case FILE_VIEW_KIND.NATIVE_DOCUMENT:
      return renderNativeDocument ?? null;
    case FILE_VIEW_KIND.PDF:
      return renderPdf ?? null;
    case FILE_VIEW_KIND.IMAGE:
      return renderImage ?? null;
    case FILE_VIEW_KIND.VIDEO:
      return renderVideo ?? null;
    case FILE_VIEW_KIND.AUDIO:
      return renderAudio ?? null;
    case FILE_VIEW_KIND.OFFICE:
      return renderOffice ?? null;
    case FILE_VIEW_KIND.SOURCE:
      return renderSource ?? null;
    case FILE_VIEW_KIND.UNKNOWN:
    default:
      return renderUnknown ?? null;
  }
};
