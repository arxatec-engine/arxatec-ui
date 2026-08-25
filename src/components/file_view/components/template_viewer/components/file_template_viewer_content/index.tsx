import { forwardRef } from "react";

import { ActiveAnnotationEditorProvider } from "../../context/active_annotation_editor_provider";
import type { ContentProps, FileTemplateViewerHandle } from "../../types";
import { FileTemplateViewerInner } from "../file_template_viewer_inner";

const FileTemplateViewerContent = forwardRef<
  FileTemplateViewerHandle,
  ContentProps
>((props, ref) => {
  return (
    <ActiveAnnotationEditorProvider>
      <FileTemplateViewerInner ref={ref} {...props} />
    </ActiveAnnotationEditorProvider>
  );
});

FileTemplateViewerContent.displayName = "FileTemplateViewerContent";

export { FileTemplateViewerContent };
