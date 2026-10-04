import { FileViewLoadingState } from "../../../loading_state";
import { useFileViewLoadingChange } from "../../../../hooks/use_file_view_loading_change";
import type { FileViewLoadingChangeHandler } from "../../../../types";

export const FileViewerPending = ({
  onLoadingChange,
}: {
  onLoadingChange?: FileViewLoadingChangeHandler;
}) => {
  useFileViewLoadingChange(true, onLoadingChange);
  return <FileViewLoadingState />;
};
