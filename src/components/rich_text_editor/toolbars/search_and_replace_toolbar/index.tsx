/* eslint-disable */
// @ts-nocheck

import { ArrowLeftIcon, ArrowRightIcon, X, Repeat } from "lucide-react";
import { useEffect, useState } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Button } from "@/components/button";
import { Checkbox } from "@/components/checkbox";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { Separator } from "@/components/separator";
import { cn } from "@/utilities";
import { useToolbar } from "../toolbar_provider";
import { type SearchAndReplaceStorage } from "../../extensions/";

export function SearchAndReplaceToolbar() {
  const { editor } = useToolbar();

  const [open, setOpen] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [checked, setChecked] = useState(false);

  const storage = editor?.storage?.searchAndReplace;
  const results = storage?.results || [];
  const selectedResult = storage?.selectedResult || 0;

  const replace = () => editor?.chain().replace().run();
  const replaceAll = () => editor?.chain().replaceAll().run();
  const selectNext = () => editor?.chain().selectNextResult().run();
  const selectPrevious = () => editor?.chain().selectPreviousResult().run();

  useEffect(() => {
    editor?.chain().setSearchTerm(searchText).run();
  }, [searchText, editor]);

  useEffect(() => {
    editor?.chain().setReplaceTerm(replaceText).run();
  }, [replaceText, editor]);

  useEffect(() => {
    editor?.chain().setCaseSensitive(checked).run();
  }, [checked, editor]);

  const [, setTick] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const handler = () => setTick((t) => t + 1);
    editor.on("transaction", handler);
    return () => {
      editor.off("transaction", handler);
    };
  }, [editor]);

  useEffect(() => {
    if (!open) {
      setReplaceText("");
      setSearchText("");
      setReplacing(false);
    }
  }, [open]);

  return (
    <Popover open={open}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger disabled={!editor} asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOpen(!open);
              }}
              className={cn("h-8 w-max px-3 font-normal")}
            >
              <Repeat className="mr-2 h-4 w-4" />
              <p>Buscar y reemplazar</p>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <span>Buscar y reemplazar</span>
        </TooltipContent>
      </Tooltip>

      <PopoverContent
        align="end"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={() => {
          setOpen(false);
        }}
        className="relative flex w-100 px-3 py-2.5"
      >
        {!replacing ? (
          <div className={cn("relative flex gap-1.5 items-center")}>
            <Input
              value={searchText}
              className=" w-48"
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              size="sm"
              placeholder="Buscar..."
            />
            <span className="text-sm text-muted-foreground min-w-10 text-center">
              {results?.length === 0 ? selectedResult : selectedResult + 1}/
              {results?.length}
            </span>
            <div className="flex items-center gap-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      selectPrevious();
                    }}
                    size="icon"
                    variant="ghost"
                    className="size-7"
                  >
                    <ArrowLeftIcon className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Anterior</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      selectNext();
                    }}
                    size="icon"
                    className="size-7"
                    variant="ghost"
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Siguiente</TooltipContent>
              </Tooltip>
            </div>
            <Separator orientation="vertical" className="h-7" />
            <div className="flex items-center gap-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      setReplacing(true);
                    }}
                    size="icon"
                    className="size-7"
                    variant="ghost"
                    title="Cambiar a modo reemplazar"
                  >
                    <Repeat className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Cambiar a modo reemplazar</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      setOpen(false);
                    }}
                    size="icon"
                    className="size-7"
                    variant="ghost"
                    title="Cerrar"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Cerrar</TooltipContent>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div className={cn("relative w-full")}>
            <X
              onClick={() => {
                setOpen(false);
              }}
              className="absolute right-3 top-3 h-4 w-4 cursor-pointer"
            />
            <div className="flex w-full items-center gap-3">
              <Button
                size="icon"
                className="size-7 rounded-full"
                variant="ghost"
                onClick={() => {
                  setReplacing(false);
                }}
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              <h2 className="text-sm font-medium">Buscar y reemplazar</h2>
            </div>

            <div className="my-2 w-full">
              <div className="mb-3">
                <Label className="mb-1 text-xs text-gray-11">Buscar</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                    }}
                    placeholder="Buscar..."
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground min-w-10 text-center">
                    {results?.length === 0
                      ? selectedResult
                      : selectedResult + 1}
                    /{results?.length}
                  </span>
                </div>
              </div>
              <div className="mb-2">
                <Label className="mb-1 text-xs text-gray-11">
                  Reemplazar con
                </Label>
                <Input
                  className="w-full"
                  value={replaceText}
                  onChange={(e) => {
                    setReplaceText(e.target.value);
                  }}
                  placeholder="Reemplazar..."
                />
              </div>
              <div className="mt-3 flex items-center space-x-2">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(checked: boolean) => {
                    setChecked(checked);
                  }}
                  id="match_case"
                />
                <Label
                  htmlFor="match_case"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Coincidir mayúsculas/minúsculas
                </Label>
              </div>
            </div>

            <div className="actions mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        selectPrevious();
                      }}
                      size="icon"
                      className="h-7 w-7"
                      variant="secondary"
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Anterior</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        selectNext();
                      }}
                      size="icon"
                      className="h-7 w-7"
                      variant="secondary"
                    >
                      <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Siguiente</TooltipContent>
                </Tooltip>
              </div>

              <div className="main-actions flex items-center gap-2">
                <Button
                  size="sm"
                  className="h-7 px-3 text-xs"
                  variant="secondary"
                  onClick={replaceAll}
                >
                  Reemplazar todo
                </Button>
                <Button
                  onClick={replace}
                  size="sm"
                  className="h-7 px-3 text-xs"
                >
                  Reemplazar
                </Button>
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
