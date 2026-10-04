import { useFileViewLoadingChange } from "../../../../hooks/use_file_view_loading_change";
import type { FileViewLoadingChangeHandler } from "../../../../types";

export const FileViewerPending = ({
  onLoadingChange,
  loading = true,
}: {
  onLoadingChange?: FileViewLoadingChangeHandler;
  loading?: boolean;
}) => {
  useFileViewLoadingChange(loading, onLoadingChange);
  return null;
};
