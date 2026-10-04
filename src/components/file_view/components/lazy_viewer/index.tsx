import {
  lazy,
  Suspense,
  useMemo,
  useState,
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
    const [attempt, setAttempt] = useState(0);
    const Viewer = useMemo(() => {
      void attempt;
      return lazy(loader);
    }, [attempt]);
    return (
      <ErrorBoundary
        onReset={() => setAttempt((value) => value + 1)}
        fallbackRender={({ resetErrorBoundary }) => (
          <div
            role="alert"
            className="flex h-full flex-col items-center justify-center gap-3"
          >
            <p>No se pudo cargar la vista previa.</p>
            <button
              type="button"
              className="rounded-md border px-3 py-2"
              onClick={resetErrorBoundary}
            >
              Reintentar
            </button>
          </div>
        )}
      >
        <Suspense
          fallback={
            <FileViewerPending
              onLoadingChange={
                (props as { onLoadingChange?: FileViewLoadingChangeHandler })
                  .onLoadingChange
              }
            />
          }
        >
          <Viewer {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}
