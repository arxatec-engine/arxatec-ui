export interface DocumentOutlineItem {
  title: string;
  level: number;
  navigate: () => void;
  position: () => number | null;
}
