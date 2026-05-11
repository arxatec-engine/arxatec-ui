import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/dropdown_menu";
import { ScrollArea } from "@/components/scroll_area";
import { Separator } from "@/components/separator";
import { CircleX, PaintRoller } from "lucide-react";

const TEXT_COLORS = [
  { name: "Predeterminado", color: null, token: "var(--editor-text-default)" },
  { name: "Gris", color: "var(--editor-text-gray)", token: "var(--editor-text-gray)" },
  { name: "Marrón", color: "var(--editor-text-brown)", token: "var(--editor-text-brown)" },
  { name: "Naranja", color: "var(--editor-text-orange)", token: "var(--editor-text-orange)" },
  { name: "Amarillo", color: "var(--editor-text-yellow)", token: "var(--editor-text-yellow)" },
  { name: "Verde", color: "var(--editor-text-green)", token: "var(--editor-text-green)" },
  { name: "Azul", color: "var(--editor-text-blue)", token: "var(--editor-text-blue)" },
  { name: "Púrpura", color: "var(--editor-text-purple)", token: "var(--editor-text-purple)" },
  { name: "Rosa", color: "var(--editor-text-pink)", token: "var(--editor-text-pink)" },
  { name: "Rojo", color: "var(--editor-text-red)", token: "var(--editor-text-red)" },
];

const BACKGROUND_COLORS = [
  { name: "Predeterminado", color: null, token: "transparent" },
  { name: "Gris", color: "var(--editor-highlight-gray)", token: "var(--editor-highlight-gray)" },
  { name: "Marrón", color: "var(--editor-highlight-brown)", token: "var(--editor-highlight-brown)" },
  { name: "Naranja", color: "var(--editor-highlight-orange)", token: "var(--editor-highlight-orange)" },
  { name: "Amarillo", color: "var(--editor-highlight-yellow)", token: "var(--editor-highlight-yellow)" },
  { name: "Verde", color: "var(--editor-highlight-green)", token: "var(--editor-highlight-green)" },
  { name: "Azul", color: "var(--editor-highlight-blue)", token: "var(--editor-highlight-blue)" },
  { name: "Púrpura", color: "var(--editor-highlight-purple)", token: "var(--editor-highlight-purple)" },
  { name: "Rosa", color: "var(--editor-highlight-pink)", token: "var(--editor-highlight-pink)" },
  { name: "Rojo", color: "var(--editor-highlight-red)", token: "var(--editor-highlight-red)" },
];

type ColorValue = string | null;

function ColorMenuButton({
  name,
  token,
  kind,
  onClick,
}: {
  name: string;
  token: string;
  kind: "text" | "background";
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="table-cell-menu-color-item justify-start"
      onClick={onClick}
    >
      <span
        className="table-cell-menu-color-swatch"
        style={kind === "text" ? { color: token } : { backgroundColor: token }}
      >
        {kind === "text" ? "A" : ""}
      </span>
      <span>{name}</span>
    </Button>
  );
}

export function TableCellMenu({
  open,
  onOpenChange,
  onSetTextColor,
  onSetBackgroundColor,
  onClearContents,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetTextColor: (color: ColorValue) => void;
  onSetBackgroundColor: (color: ColorValue) => void;
  onClearContents: () => void;
}) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange} modal={false}>
      <DropdownMenuTrigger asChild>
        <span className="table-cell-menu-anchor" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="right"
        sideOffset={0}
        className="table-cell-menu-main"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="table-cell-menu-item">
            <PaintRoller className="table-cell-menu-icon" />
            <span>Color</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="table-cell-menu-panel">
            <ScrollArea className="h-80 pb-2">
              <div className="table-cell-menu-title">Text color</div>
              <div className="table-cell-menu-list">
                {TEXT_COLORS.map(({ name, color, token }) => (
                  <ColorMenuButton
                    key={name}
                    name={`${name} text`}
                    token={token}
                    kind="text"
                    onClick={() => onSetTextColor(color)}
                  />
                ))}
              </div>

              <Separator className="my-3" />

              <div className="table-cell-menu-title">Background color</div>
              <div className="table-cell-menu-list">
                {BACKGROUND_COLORS.map(({ name, color, token }) => (
                  <ColorMenuButton
                    key={name}
                    name={`${name} background`}
                    token={token}
                    kind="background"
                    onClick={() => onSetBackgroundColor(color)}
                  />
                ))}
              </div>
            </ScrollArea>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem className="table-cell-menu-item" onSelect={onClearContents}>
          <CircleX className="table-cell-menu-icon" />
          <span>Clear contents</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
