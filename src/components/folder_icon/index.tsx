import type { SVGProps } from "react";
import { cn } from "../../utilities/class";
import {
  FOLDER_BODY,
  FOLDER_FRONT,
  FOLDER_VARIANT,
  MARK_COLOR,
  MARKS,
  type FolderVariant,
} from "./constants";

export interface FolderIconProps extends SVGProps<SVGSVGElement> {
  variant?: FolderVariant;
}

export const FolderIcon = ({
  className = "size-4",
  variant = FOLDER_VARIANT.DEFAULT,
  ...props
}: FolderIconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={cn("shrink-0 text-primary", className)}
    {...props}
  >
    <path d={FOLDER_BODY} fill="currentColor" />
    <path d={FOLDER_FRONT} fill="#fff" opacity="0.18" />
    <g fill={MARK_COLOR} opacity="0.95">
      {MARKS[variant]}
    </g>
  </svg>
);

export { FOLDER_BODY, FOLDER_FRONT, FOLDER_VARIANT } from "./constants";
export type { FolderVariant } from "./constants";
