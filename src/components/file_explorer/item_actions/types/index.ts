import type { LucideIcon } from "lucide-react";

export interface ExplorerAction {
  key: string;
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  separatorBefore?: boolean;
  hidden?: boolean;
}
