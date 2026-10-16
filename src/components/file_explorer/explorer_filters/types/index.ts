import type { LucideIcon } from "lucide-react";

export interface ExplorerFilterOption {
  value: string;
  label: string;
  icon: LucideIcon;
  mimeType?: string;
}
