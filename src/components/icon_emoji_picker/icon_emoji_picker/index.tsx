import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/emoji_picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { useState, type ComponentProps, type ReactNode } from "react";
import { IconGrid } from "../icon_grid";
import { isEmojiIcon } from "../utils";

const EMOJI_COLUMNS = 12;

type PickerTab = "icon" | "emoji";
export type IconEmojiPickerLocale = NonNullable<
  ComponentProps<typeof EmojiPicker>["locale"]
>;

export interface IconEmojiPickerLabels {
  icons: string;
  emojis: string;
  searchIcons: string;
  searchEmojis: string;
  emptyIcons: string;
  emptyEmojis: string;
  emojiHint: string;
}

const DEFAULT_LABELS: IconEmojiPickerLabels = {
  icons: "Iconos",
  emojis: "Emojis",
  searchIcons: "Buscar un icono…",
  searchEmojis: "Buscar un emoji…",
  emptyIcons: "No se encontró ningún icono.",
  emptyEmojis: "Emoji no encontrado.",
  emojiHint: "Seleccionar un emoji…",
};

export interface IconEmojiPickerProps {
  value?: string | null;
  onValueChange: (value: string) => void;
  children: ReactNode;
  align?: "start" | "center" | "end";
  modal?: boolean;
  disabled?: boolean;
  labels?: Partial<IconEmojiPickerLabels>;
  locale?: IconEmojiPickerLocale;
}

export const IconEmojiPicker = ({
  value,
  onValueChange,
  children,
  align = "start",
  modal,
  disabled = false,
  labels,
  locale = "es",
}: IconEmojiPickerProps) => {
  const copy = { ...DEFAULT_LABELS, ...labels };
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<PickerTab>("icon");

  const onOpenChange = (next: boolean) => {
    if (next) setTab(isEmojiIcon(value) ? "emoji" : "icon");
    setOpen(next);
  };

  const select = (next: string) => {
    onValueChange(next);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange} modal={modal}>
      <PopoverTrigger asChild disabled={disabled}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className="overflow-hidden p-0"
        style={{ width: `calc(${EMOJI_COLUMNS * 1.75 + 0.5}rem + 10px)` }}
      >
        <Tabs value={tab} onValueChange={(next) => setTab(next as PickerTab)}>
          <TabsList className="w-full rounded-none border-b p-1">
            <TabsTrigger value="icon" className="font-normal">
              {copy.icons}
            </TabsTrigger>
            <TabsTrigger value="emoji" className="font-normal">
              {copy.emojis}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="icon" className="mt-0">
            <IconGrid
              value={value}
              onSelect={select}
              searchPlaceholder={copy.searchIcons}
              emptyText={copy.emptyIcons}
            />
          </TabsContent>

          <TabsContent value="emoji" className="mt-0">
            <EmojiPicker
              locale={locale}
              columns={EMOJI_COLUMNS}
              className="h-[300px] w-full"
              onEmojiSelect={({ emoji }) => select(emoji)}
              onWheel={(event) => event.stopPropagation()}
            >
              <EmojiPickerSearch placeholder={copy.searchEmojis} />
              <EmojiPickerContent emptyLabel={copy.emptyEmojis} />
              <EmojiPickerFooter emptyLabel={copy.emojiHint} />
            </EmojiPicker>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
