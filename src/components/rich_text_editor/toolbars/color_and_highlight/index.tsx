import { ScrollArea } from "@/components/scroll_area";
import { Separator } from "@/components/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { cn } from "@/utilities";
import { useToolbar } from "../toolbar_provider";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useMediaQuery } from "@/hooks";
import { MobileToolbarGroup, MobileToolbarItem } from "../mobile_toolbar_group";

const TEXT_COLORS = [
  { name: "Predeterminado", color: "var(--editor-text-default)" },
  { name: "Gris", color: "var(--editor-text-gray)" },
  { name: "Marrón", color: "var(--editor-text-brown)" },
  { name: "Naranja", color: "var(--editor-text-orange)" },
  { name: "Amarillo", color: "var(--editor-text-yellow)" },
  { name: "Verde", color: "var(--editor-text-green)" },
  { name: "Azul", color: "var(--editor-text-blue)" },
  { name: "Púrpura", color: "var(--editor-text-purple)" },
  { name: "Rosa", color: "var(--editor-text-pink)" },
  { name: "Rojo", color: "var(--editor-text-red)" },
];

const HIGHLIGHT_COLORS = [
  { name: "Predeterminado", color: "var(--editor-highlight-default)" },
  { name: "Gris", color: "var(--editor-highlight-gray)" },
  { name: "Marrón", color: "var(--editor-highlight-brown)" },
  { name: "Naranja", color: "var(--editor-highlight-orange)" },
  { name: "Amarillo", color: "var(--editor-highlight-yellow)" },
  { name: "Verde", color: "var(--editor-highlight-green)" },
  { name: "Azul", color: "var(--editor-highlight-blue)" },
  { name: "Púrpura", color: "var(--editor-highlight-purple)" },
  { name: "Rosa", color: "var(--editor-highlight-pink)" },
  { name: "Rojo", color: "var(--editor-highlight-red)" },
];

interface ColorHighlightButtonProps {
  name: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
  isHighlight?: boolean;
}

const ColorHighlightButton = ({
  name,
  color,
  isActive,
  onClick,
  isHighlight,
}: ColorHighlightButtonProps) => (
  <button
    onClick={onClick}
    className="flex w-full items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-muted cursor-pointer"
    type="button"
  >
    <div className="flex items-center space-x-2 ">
      <div
        className="rounded-sm border size-5 font-medium"
        style={isHighlight ? { backgroundColor: color } : { color }}
      >
        A
      </div>
      <span>{name}</span>
    </div>
    {isActive && <CheckIcon className="h-4 w-4" />}
  </button>
);

export const ColorHighlightToolbar = () => {
  const { editor } = useToolbar();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const currentColor = editor?.getAttributes("textStyle").color;
  const currentHighlight = editor?.getAttributes("highlight").color;

  const handleSetColor = (color: string) => {
    editor
      ?.chain()
      .focus()
      .setColor(color === currentColor ? "" : color)
      .run();
  };

  const handleSetHighlight = (color: string) => {
    editor
      ?.chain()
      .focus()
      .setHighlight(color === currentHighlight ? { color: "" } : { color })
      .run();
  };

  const isDisabled =
    !editor?.can().chain().setHighlight().run() ||
    !editor?.can().chain().setColor("").run();

  if (isMobile) {
    return (
      <div className="flex gap-1">
        <MobileToolbarGroup label="Color">
          {TEXT_COLORS.map(({ name, color }) => (
            <MobileToolbarItem
              key={name}
              onClick={() => handleSetColor(color)}
              active={currentColor === color}
            >
              <div className="flex items-center gap-2">
                <div className="rounded-sm border px-2" style={{ color }}>
                  A
                </div>
                <span>{name}</span>
              </div>
            </MobileToolbarItem>
          ))}
        </MobileToolbarGroup>

        <MobileToolbarGroup label="Resaltado">
          {HIGHLIGHT_COLORS.map(({ name, color }) => (
            <MobileToolbarItem
              key={name}
              onClick={() => handleSetHighlight(color)}
              active={currentHighlight === color}
            >
              <div className="flex items-center gap-2">
                <div
                  className="rounded-sm border px-2"
                  style={{ backgroundColor: color }}
                >
                  A
                </div>
                <span>{name}</span>
              </div>
            </MobileToolbarItem>
          ))}
        </MobileToolbarGroup>
      </div>
    );
  }

  return (
    <Popover>
      <div className="relative h-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger disabled={isDisabled} asChild>
              <Button
                variant="ghost"
                size="sm"
                style={{
                  color: currentColor,
                }}
                className={cn("h-8 w-14 p-0 font-normal")}
              >
                <span className="text-md">A</span>
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Color de Texto y Resaltado</TooltipContent>
        </Tooltip>

        <PopoverContent
          align="start"
          className="w-56 p-0! dark:bg-gray-2"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <ScrollArea className="h-80 pb-2">
            <div className="mb-1 mt-2 px-2 text-xs text-muted-foreground uppercase">
              Color
            </div>
            <div className="px-2">
              {TEXT_COLORS.map(({ name, color }) => (
                <ColorHighlightButton
                  key={name}
                  name={name}
                  color={color}
                  isActive={currentColor === color}
                  onClick={() => handleSetColor(color)}
                />
              ))}
            </div>

            <Separator className="my-3" />

            <div className="mb-1 w-full px-2 text-xs text-muted-foreground uppercase">
              Fondo (Resaltado)
            </div>
            <div className="px-2">
              {HIGHLIGHT_COLORS.map(({ name, color }) => (
                <ColorHighlightButton
                  key={name}
                  name={name}
                  color={color}
                  isActive={currentHighlight === color}
                  onClick={() => handleSetHighlight(color)}
                  isHighlight
                />
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </div>
    </Popover>
  );
};
