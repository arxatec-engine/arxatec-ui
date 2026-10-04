import {
  lazy,
  Suspense,
  useMemo,
  type ComponentType,
  type ReactNode,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FileViewerPending } from "./components/pending";
import type { FileViewLoadingChangeHandler } from "../../types";

export function lazyFileViewer<P extends object>(
  loader: () => Promise<{ default: (props: P) => ReactNode }>,
): ComponentType<P> {
  return function LazyFileViewer(props: P) {
    const Viewer = useMemo(() => lazy(loader), []);
    const onLoadingChange = (
      props as {
        onLoadingChange?: FileViewLoadingChangeHandler;
      }
    ).onLoadingChange;
    return (
      <ErrorBoundary
        fallbackRender={() => (
          <FileViewerPending
            loading={false}
            onLoadingChange={onLoadingChange}
          />
        )}
      >
        <Suspense
          fallback={<FileViewerPending onLoadingChange={onLoadingChange} />}
        >
          <Viewer {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}
