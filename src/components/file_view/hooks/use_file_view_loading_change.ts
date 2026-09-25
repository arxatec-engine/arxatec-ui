import { useLayoutEffect } from "react";
import type { FileViewLoadingChangeHandler } from "../types";

export const useFileViewLoadingChange = (
  isLoading: boolean,
  onLoadingChange?: FileViewLoadingChangeHandler,
) => {
  useLayoutEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  useLayoutEffect(
    () => () => {
      onLoadingChange?.(false);
    },
    [onLoadingChange],
  );
};
