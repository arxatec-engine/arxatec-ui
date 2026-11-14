import type { ComponentProps } from "react";

import { lazyFileViewer } from "../../lazy_viewer";

export const FileDocxPreviewViewer = lazyFileViewer<
  ComponentProps<
    typeof import("../../docx_preview_viewer").FileDocxPreviewViewer
  >
>(() =>
  import("../../docx_preview_viewer").then((module) => ({
    default: module.FileDocxPreviewViewer,
  })),
);

export const FileXlsxPreviewViewer = lazyFileViewer<
  ComponentProps<
    typeof import("../../xlsx_preview_viewer").FileXlsxPreviewViewer
  >
>(() =>
  import("../../xlsx_preview_viewer").then((module) => ({
    default: module.FileXlsxPreviewViewer,
  })),
);

export const FilePptxPreviewViewer = lazyFileViewer<
  ComponentProps<
    typeof import("../../pptx_preview_viewer").FilePptxPreviewViewer
  >
>(() =>
  import("../../pptx_preview_viewer").then((module) => ({
    default: module.FilePptxPreviewViewer,
  })),
);
