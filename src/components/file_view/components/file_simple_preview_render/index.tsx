import { cn } from "@/utilities/class";

import type { FileSimplePreviewRenderProps } from "./types";
import { FileSimplePreviewRenderContent } from "./components/content";

export const FileSimplePreviewRender = ({
  className,
  ...props
}: FileSimplePreviewRenderProps) => (
  <div
    data-slot="file-simple-preview-render"
    className={cn("relative h-full min-h-0 w-full", className)}
  >
    <FileSimplePreviewRenderContent {...props} />
  </div>
);

export type { FileSimplePreviewRenderProps } from "./types";
