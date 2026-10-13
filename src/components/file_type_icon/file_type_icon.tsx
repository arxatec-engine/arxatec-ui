import type { SVGProps } from "react";
import { cn } from "../../utilities/class";
import {
  getFileKindStyle,
  getFileTypeLabel,
  LABEL_FONT_SIZE,
  SHEET_BAND,
  SHEET_BODY,
  SHEET_FOLD,
} from "./file_kind";

export interface FileTypeIconProps extends SVGProps<SVGSVGElement> {
  mimeType: string;
  fileName?: string;
}

export const FileTypeIcon = ({
  mimeType,
  className = "size-4",
  fileName,
  ...props
}: FileTypeIconProps) => {
  const { color } = getFileKindStyle(mimeType);
  const label = getFileTypeLabel(mimeType, fileName);

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      data-file-label={label}
      className={cn("shrink-0", color, className)}
      {...props}
    >
      <path d={SHEET_BODY} fill="currentColor" />
      <path d={SHEET_FOLD} fill="currentColor" opacity="0.45" />
      <g fill="#fff" opacity="0.9">
        <rect x="7.4" y="9.6" width="8" height="1.5" rx="0.75" />
        <rect x="7.4" y="12.2" width="5" height="1.5" rx="0.75" />
      </g>
      <path d={SHEET_BAND} fill="currentColor" />
      <path d={SHEET_BAND} fill="#000" opacity="0.24" />
      <text
        x="12.25"
        y="20"
        textAnchor="middle"
        fill="#fff"
        fontSize={LABEL_FONT_SIZE[label.length] ?? 5.2}
        fontWeight="700"
        letterSpacing="-0.15"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      >
        {label}
      </text>
    </svg>
  );
};
