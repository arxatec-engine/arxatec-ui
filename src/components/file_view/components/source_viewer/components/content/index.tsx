import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { ScrollArea, ScrollBar } from "@/components/scroll_area";
import { cn } from "@/utilities/class";

import { SOURCE_SCROLL_AREA_CLASS, SOURCE_SYNTAX_THEME } from "../../constants";
import { useSourceViewerControls } from "../../hooks/use_source_viewer_controls";
import { useSourceLineNumbers } from "../../hooks/use_source_line_numbers";
import { SourceToolbar } from "../toolbar";
import type {
  FileSourceViewerLabels,
  FileSourceViewerProps,
} from "../../types";

interface Props extends Pick<
  FileSourceViewerProps,
  "fileName" | "onDownload" | "className"
> {
  content: string;
  language: string;
  labels: FileSourceViewerLabels;
}

export const SourceContent = ({
  content,
  language,
  fileName,
  onDownload,
  labels,
  className,
}: Props) => {
  const controls = useSourceViewerControls(
    content,
    fileName,
    labels,
    onDownload,
  );
  const { containerRef, emptyLineStart, emptyLineCount } = useSourceLineNumbers(
    content,
    controls.fontSize,
  );

  return (
    <div
      ref={containerRef}
      data-slot="file-source-viewer"
      className={cn(
        "relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-background font-normal text-foreground",
        className,
      )}
    >
      <ScrollArea
        className={SOURCE_SCROLL_AREA_CLASS}
        aria-label={fileName}
        style={{
          fontSize: `calc(${controls.fontSize / 16}rem * var(--font-scale, 1))`,
          lineHeight: 1.8,
          fontFamily: "var(--editor-font-mono, ui-monospace, monospace)",
        }}
      >
        <SyntaxHighlighter
          language={language}
          style={SOURCE_SYNTAX_THEME}
          showLineNumbers
          wrapLines
          wrapLongLines={controls.wrapLines}
          lineProps={{
            style: {
              display: "block",
              position: "relative",
              paddingLeft: "4.25em",
              minHeight: "1.8em",
            },
          }}
          customStyle={{
            margin: 0,
            padding: "1.25rem 1rem 0",
            fontSize: "inherit",
            lineHeight: 1.8,
            background: "transparent",
            overflow: "visible",
            tabSize: 2,
          }}
          lineNumberStyle={{
            minWidth: "3em",
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            paddingRight: "1em",
            color: "var(--muted-foreground)",
            fontStyle: "normal",
            userSelect: "none",
          }}
          codeTagProps={{
            style: {
              display: "block",
              fontFamily: "var(--editor-font-mono, ui-monospace, monospace)",
              overflowWrap: controls.wrapLines ? "anywhere" : "normal",
            },
          }}
        >
          {content}
        </SyntaxHighlighter>
        <div
          data-slot="source-empty-lines"
          aria-hidden="true"
          className="select-none text-muted-foreground"
          style={{ padding: "0 1rem 7rem" }}
        >
          {Array.from({ length: emptyLineCount }, (_, index) => (
            <div key={index} style={{ height: "1.8em" }}>
              <span
                className="react-syntax-highlighter-line-number inline-block text-right"
                style={{ minWidth: "3em", paddingRight: "1em" }}
              >
                {emptyLineStart + index}
              </span>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <SourceToolbar controls={controls} labels={labels} />
    </div>
  );
};
