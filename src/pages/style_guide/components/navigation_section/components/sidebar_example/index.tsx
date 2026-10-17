import { Folder, Home, Inbox, PanelLeft } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/sidebar";
import { cn } from "@/utilities";

import { ComponentPreview } from "../../../component_preview";

export const SidebarExample = () => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Inicio");

  return (
    <ComponentPreview
      title="Sidebar"
      description="Da acceso estable a las áreas de una aplicación. Se puede contraer cuando el contenido necesita más espacio."
      className="md:col-span-2"
    >
      <div className="isolate h-60 overflow-hidden rounded-lg border bg-background">
        <SidebarProvider
          open={open}
          onOpenChange={setOpen}
          className="h-full min-h-0"
        >
          <Sidebar
            collapsible="none"
            className={cn(
              "h-full shrink-0 border-r transition-[width] motion-reduce:transition-none",
              open ? "w-40" : "w-12",
            )}
          >
            <SidebarHeader className="border-b p-4">
              <span className="truncate text-sm font-medium">
                {open ? "Espacio de trabajo" : "A"}
              </span>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarMenu>
                  {[
                    { label: "Inicio", icon: Home },
                    { label: "Bandeja", icon: Inbox },
                    { label: "Proyectos", icon: Folder },
                  ].map(({ label, icon: Icon }) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton
                        isActive={selected === label}
                        onClick={() => setSelected(label)}
                        aria-label={label}
                        className={cn(!open && "justify-center px-0")}
                      >
                        <Icon aria-hidden="true" />
                        {open && <span>{label}</span>}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <div className="flex min-w-0 flex-1 flex-col bg-background">
            <header className="flex h-12 items-center gap-3 border-b px-4">
              <Button
                variant="ghost"
                size="icon"
                aria-label={
                  open ? "Contraer navegación" : "Expandir navegación"
                }
                onClick={() => setOpen(!open)}
              >
                <PanelLeft aria-hidden="true" />
              </Button>
              <span className="truncate text-sm">{selected}</span>
            </header>
            <div className="space-y-4 p-5">
              <p className="text-sm text-muted-foreground">
                El contenido tiene su propio espacio.
              </p>
              <div className="h-16 rounded-md bg-muted/60" />
            </div>
          </div>
        </SidebarProvider>
      </div>
    </ComponentPreview>
  );
};
