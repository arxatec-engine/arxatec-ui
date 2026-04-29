export interface MentionItem {
  id: string;
  label: string;
  image?: string;
  subtitle?: string;
}

export interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export interface MentionListProps {
  items: MentionItem[];
  command: (props: { id: string; label: string }) => void;
  selectedIndex?: number;
  query?: string;
}
