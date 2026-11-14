import { cn } from "@/utilities/class";

import type { FileUrlPreviewRenderProps } from "./types";
import { FileUrlPreviewRenderContent } from "./components/content";

export const FileUrlPreviewRender = ({
  className,
  ...props
}: FileUrlPreviewRenderProps) => (
  <div
    data-slot="file-url-preview-render"
    className={cn("relative h-full min-h-0 w-full", className)}
  >
    <FileUrlPreviewRenderContent {...props} />
  </div>
);

export type { FileUrlPreviewRenderProps } from "./types";
