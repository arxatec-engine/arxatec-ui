import type { ComponentProps } from "react";

import { lazyFileViewer } from "../../lazy_viewer";

export const FileImageViewer = lazyFileViewer<
  ComponentProps<typeof import("../../image_viewer").FileImageViewer>
>(() =>
  import("../../image_viewer").then((module) => ({
    default: module.FileImageViewer,
  })),
);

export const FileOfficeViewer = lazyFileViewer<
  ComponentProps<typeof import("../../office_viewer").FileOfficeViewer>
>(() =>
  import("../../office_viewer").then((module) => ({
    default: module.FileOfficeViewer,
  })),
);

export const FilePdfViewer = lazyFileViewer<
  ComponentProps<typeof import("../../pdf_viewer").FilePdfViewer>
>(() =>
  import("../../pdf_viewer").then((module) => ({
    default: module.FilePdfViewer,
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
