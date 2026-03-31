import React, { type FormEvent } from "react";
import { PopoverClose } from "@radix-ui/react-popover";
import { Trash2, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { cn } from "@/utilities/index";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { useToolbar } from "../toolbar_provider";
import { getUrlFromString } from "@/utilities";

const LinkToolbar = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { editor } = useToolbar();
  const [link, setLink] = React.useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const url = getUrlFromString(link);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    url && editor?.chain().focus().setLink({ href: url }).run();
  };

  React.useEffect(() => {
    setLink(editor?.getAttributes("link").href ?? "");
  }, [editor]);

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger
            disabled={!editor?.can().setLink({ href: "" })}
            asChild
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-max px-3 font-normal",
                editor?.isActive("link") && "bg-accent",
                className
              )}
              ref={ref}
              {...props}
            >
              <p className="mr-2 text-base">↗</p>
              <p className={"underline decoration-gray-7 underline-offset-4"}>
                Enlace
              </p>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <span>Enlace</span>
        </TooltipContent>
      </Tooltip>

      <PopoverContent
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
        asChild
        className="relative px-3 py-2.5"
      >
        <div className="relative">
          <PopoverClose className="absolute right-3 top-3">
            <X className="h-4 w-4" />
          </PopoverClose>
          <form onSubmit={handleSubmit}>
            <Label>Enlace</Label>
            <p className="text-sm text-gray-11">
              Adjunta un enlace al texto seleccionado
            </p>
            <div className="mt-3 flex flex-col items-end justify-end gap-3">
              <Input
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
                className="w-full"
                placeholder="https://ejemplo.com"
              />
              <div className="flex items-center gap-3">
                {editor?.getAttributes("link").href && (
                  <Button
                    type="reset"
                    size="sm"
                    className="h-8 text-gray-11"
                    variant="ghost"
                    onClick={() => {
                      editor?.chain().focus().unsetLink().run();
                      setLink("");
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                )}
                <Button size="sm" className="h-8">
                  {editor?.getAttributes("link").href
                    ? "Actualizar"
                    : "Confirmar"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
});

LinkToolbar.displayName = "LinkToolbar";

export { LinkToolbar };
