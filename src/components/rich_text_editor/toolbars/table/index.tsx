import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/dropdown_menu";
import { Table as TableIcon, Plus, Trash2, ChevronDown } from "lucide-react";
import { useToolbar } from "../toolbar_provider";

export const TableToolbar = () => {
  const { editor } = useToolbar();

  if (!editor) return null;

  const isActive = editor.isActive("table");

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  return (
    <div className="flex items-center gap-0.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 ${isActive ? "bg-accent text-accent-foreground" : ""}`}
            onClick={insertTable}
          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Insertar Tabla (3x3)</span>
        </TooltipContent>
      </Tooltip>

      {isActive && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-5 px-0">
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem
              onClick={() => editor.chain().focus().addColumnBefore().run()}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Añadir columna antes</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Añadir columna después</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Eliminar columna</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => editor.chain().focus().addRowBefore().run()}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Añadir fila antes</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Añadir fila después</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Eliminar fila</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => editor.chain().focus().mergeCells().run()}
            >
              <span>Combinar celdas</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().splitCell().run()}
            >
              <span>Dividir celda</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Eliminar tabla</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
