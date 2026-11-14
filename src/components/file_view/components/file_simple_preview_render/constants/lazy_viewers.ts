import type { ComponentProps } from "react";

import { lazyFileViewer } from "../../lazy_viewer";

export const FileAudioPlayer = lazyFileViewer<
  ComponentProps<typeof import("../../audio_player").FileAudioPlayer>
>(() =>
  import("../../audio_player").then((module) => ({
    default: module.FileAudioPlayer,
  })),
);

export const FileDocxPreviewViewer = lazyFileViewer<
  ComponentProps<
    typeof import("../../docx_preview_viewer").FileDocxPreviewViewer
  >
>(() =>
  import("../../docx_preview_viewer").then((module) => ({
    default: module.FileDocxPreviewViewer,
  })),
);

export const FileImageViewer = lazyFileViewer<
  ComponentProps<typeof import("../../image_viewer").FileImageViewer>
>(() =>
  import("../../image_viewer").then((module) => ({
    default: module.FileImageViewer,
  })),
);

export const FilePdfViewer = lazyFileViewer<
  ComponentProps<typeof import("../../pdf_viewer").FilePdfViewer>
>(() =>
  import("../../pdf_viewer").then((module) => ({
    default: module.FilePdfViewer,
  })),
);

export const FileSourceFileViewer = lazyFileViewer<
  ComponentProps<
    typeof import("../../file_source_file_viewer").FileSourceFileViewer
  >
>(() =>
  import("../../file_source_file_viewer").then((module) => ({
    default: module.FileSourceFileViewer,
  })),
);

export const FileVideoPlayer = lazyFileViewer<
  ComponentProps<typeof import("../../video_player").FileVideoPlayer>
>(() =>
  import("../../video_player").then((module) => ({
    default: module.FileVideoPlayer,
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
