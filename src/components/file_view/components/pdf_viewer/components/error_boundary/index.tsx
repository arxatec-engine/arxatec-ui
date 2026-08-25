import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { ErrorState } from "../error_state";

interface Props {
  children: React.ReactNode;
}

export const ErrorBoundary = ({ children }: Props) => {
  return (
    <ReactErrorBoundary
      fallback={<ErrorState />}
      onError={(error, info) => {
        console.error("PDF Viewer Error:", error, info);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};
