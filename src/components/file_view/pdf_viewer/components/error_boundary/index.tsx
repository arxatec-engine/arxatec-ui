import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { ErrorState } from "../error_state";

interface Props {
  children: React.ReactNode;
}

export const ErrorBoundary: React.FC<Props> = ({ children }) => {
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
