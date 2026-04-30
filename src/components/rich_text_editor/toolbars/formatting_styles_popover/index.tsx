import * as React from "react";
import {
  BoldIcon,
  CaseSensitive,
  Code2,
  Code,
  ItalicIcon,
  Strikethrough,
  TextQuote,
  UnderlineIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/popover";
import { Button } from "@/components/button";
import { cn } from "@/utilities";
import { useToolbar } from "../toolbar_provider";

const itemClass =
  "relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground";

export function FormattingStylesPopoverToolbar() {
  const { editor } = useToolbar();
  const [open, setOpen] = React.useState(false);

  const isAnythingActive =
    Boolean(
      editor?.isActive("blockquote") ||
        editor?.isActive("code") ||
        editor?.isActive("codeBlock") ||
        editor?.isActive("bold") ||
        editor?.isActive("italic") ||
        editor?.isActive("underline") ||
        editor?.isActive("strike"),
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-expanded={open}
          aria-haspopup="dialog"
          className={cn(
            "size-7 shrink-0",
            isAnythingActive && "bg-accent",
          )}
        >
          <CaseSensitive className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="z-110 w-fit min-w-52 p-1">
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            className={cn(itemClass, editor?.isActive("blockquote") && "bg-accent")}
            disabled={!editor?.can().toggleBlockquote()}
            onClick={() => {
              editor?.chain().focus().toggleBlockquote().run();
              setOpen(false);
            }}
          >
            <TextQuote />
            Cita
          </button>
          <button
            type="button"
            className={cn(itemClass, editor?.isActive("code") && "bg-accent")}
            disabled={!editor?.can().toggleCode()}
            onClick={() => {
              editor?.chain().focus().toggleCode().run();
              setOpen(false);
            }}
          >
            <Code2 />
            Código en línea
          </button>
          <button
            type="button"
            className={cn(itemClass, editor?.isActive("codeBlock") && "bg-accent")}
            disabled={!editor?.can().toggleCodeBlock()}
            onClick={() => {
              editor?.chain().focus().toggleCodeBlock().run();
              setOpen(false);
            }}
          >
            <Code />
            Bloque de código
          </button>

          <div role="presentation" className="my-1 h-px bg-border" />

          <button
            type="button"
            className={cn(itemClass, editor?.isActive("bold") && "bg-accent")}
            disabled={!editor?.can().toggleBold()}
            onClick={() => {
              editor?.chain().focus().toggleBold().run();
              setOpen(false);
            }}
          >
            <BoldIcon />
            Negrita
          </button>
          <button
            type="button"
            className={cn(itemClass, editor?.isActive("italic") && "bg-accent")}
            disabled={!editor?.can().toggleItalic()}
            onClick={() => {
              editor?.chain().focus().toggleItalic().run();
              setOpen(false);
            }}
          >
            <ItalicIcon />
            Cursiva
          </button>
          <button
            type="button"
            className={cn(itemClass, editor?.isActive("underline") && "bg-accent")}
            disabled={!editor?.can().toggleUnderline()}
            onClick={() => {
              editor?.chain().focus().toggleUnderline().run();
              setOpen(false);
            }}
          >
            <UnderlineIcon />
            Subrayado
          </button>
          <button
            type="button"
            className={cn(itemClass, editor?.isActive("strike") && "bg-accent")}
            disabled={!editor?.can().toggleStrike()}
            onClick={() => {
              editor?.chain().focus().toggleStrike().run();
              setOpen(false);
            }}
          >
            <Strikethrough />
            Tachado
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
