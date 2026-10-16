import { Button } from "../button";
import { EXPLORER_GRID_CLASS } from "../file_explorer/constants";
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "../../utilities/class";

export interface ExplorerSectionProps {
  title: string;
  children: ReactNode;
  isGrid?: boolean;
  actions?: ReactNode;
  footer?: ReactNode;
}

export const ExplorerSection = ({
  title,
  children,
  isGrid = true,
  actions,
  footer,
}: ExplorerSectionProps) => {
  const [open, setOpen] = useState(true);

  return (
    <section className="flex flex-col">
      <div className="flex min-h-8 items-center justify-between gap-2">
        <h2 className="min-w-0">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200",
                !open && "-rotate-90",
              )}
            />
            {title}
          </Button>
        </h2>

        {actions}
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="flex flex-col gap-3 pt-3">
            <div
              className={cn(
                isGrid ? EXPLORER_GRID_CLASS : "flex flex-col gap-2",
              )}
            >
              {children}
            </div>
            {footer}
          </div>
        </div>
      </div>
    </section>
  );
};
