import { forwardRef } from "react";
import { Document, Page } from "react-pdf";

import { ScrollArea, ScrollBar } from "@/components/scroll_area";
import { cn } from "@/utilities/class";

import "../../../../utilities/setup_pdf_worker";
import { DEFAULT_PAGE_DIMENSIONS } from "./constants";
import { usePdfPageVisibility } from "./hooks/use_pdf_page_visibility";
import type { ContentHandle } from "./types";

interface Props {
  url: string;
  scale: number;
  numPages: number;
  onLoadSuccess: (data: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
  onVisiblePageChange: (page: number) => void;
  className?: string;
}

export const Content = forwardRef<ContentHandle, Props>(
  (
    {
      url,
      scale,
      numPages,
      onLoadSuccess,
      onLoadError,
      onVisiblePageChange,
      className,
    },
    ref,
  ) => {
    const {
      containerRef,
      renderedPages,
      pageDimensions,
      setPageDimensions,
      registerPageElement,
      options,
    } = usePdfPageVisibility(ref, onVisiblePageChange);
    const { width, height } = pageDimensions ?? DEFAULT_PAGE_DIMENSIONS;
    const placeholderStyle = {
      width: width * scale,
      height: height * scale,
    };

    return (
      <ScrollArea
        viewportRef={containerRef}
        data-slot="pdf-viewer-content"
        className={cn(
          "h-full min-h-0 w-full min-w-0 flex-1 overflow-hidden bg-background",
          className,
        )}
      >
        <Document
          file={url}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading={null}
          options={options}
          className="isolate flex w-max min-w-full flex-col items-center gap-4 p-6"
        >
          {Array.from({ length: numPages }, (_, index) => {
            const page = index + 1;
            return (
              <div
                key={page}
                ref={registerPageElement(page)}
                data-slot="pdf-page"
                data-page={page}
                className="overflow-hidden rounded-md border border-border bg-background"
              >
                {renderedPages.has(page) ? (
                  <Page
                    pageNumber={page}
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    loading={<div style={placeholderStyle} />}
                    onLoadSuccess={(loadedPage) =>
                      setPageDimensions(
                        (prev) =>
                          prev ?? {
                            width: loadedPage.originalWidth,
                            height: loadedPage.originalHeight,
                          },
                      )
                    }
                  />
                ) : (
                  <div style={placeholderStyle} />
                )}
              </div>
            );
          })}
        </Document>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  },
);

Content.displayName = "Content";

export type { ContentHandle } from "./types";
