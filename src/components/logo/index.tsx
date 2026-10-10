import { cn } from "@/utilities/index";

import { LOGOS } from "./constants";
import type { LogoVariant } from "./types";

export type { LogoVariant } from "./types";

export interface LogoProps {
  className?: string;
  variant?: LogoVariant;
}

export const Logo = ({ className, variant = "arxatec" }: LogoProps) => {
  const { viewBox, paths, separator } = LOGOS[variant];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-slot="logo"
      className={cn(className)}
      viewBox={viewBox}
      fill="none"
    >
      {paths.map((d) => (
        <path key={d} d={d} fill="currentColor" />
      ))}
      {separator && <circle {...separator} fill="currentColor" />}
    </svg>
  );
};
