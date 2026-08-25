import { forwardRef } from "react";

import { FileTemplateViewerContent } from "./components/file_template_viewer_content";
import type {
  FileTemplateViewerHandle,
  FileTemplateViewerProps,
} from "./types";

export const FileTemplateViewer = forwardRef<
  FileTemplateViewerHandle,
  FileTemplateViewerProps
>((props, ref) => {
  return <FileTemplateViewerContent key={props.fileId} ref={ref} {...props} />;
});

FileTemplateViewer.displayName = "FileTemplateViewer";

export { FileTemplateViewer as TemplateViewer };
export { FileTemplateViewerContent } from "./components/file_template_viewer_content";
export type {
  ContentProps,
  FileTemplateViewerFeatures,
  FileTemplateViewerHandle,
  FileTemplateViewerProps,
  TemplateViewerHandle,
} from "./types";
