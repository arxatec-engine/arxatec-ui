import type { ComponentType, ReactNode } from "react";

import type { THEMES } from "../constants";

export type ChartConfig = {
  [k in string]: {
    label?: ReactNode;
    icon?: ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

export type ChartContextProps = {
  config: ChartConfig;
};
