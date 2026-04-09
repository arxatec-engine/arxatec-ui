import { Inbox, Sparkles } from "lucide-react";
import { cn } from "@/utilities/index";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/exports";

import { ShowcaseBlock } from "../showcase_block";

export function NavigationSection() {
  return (
    <ShowcaseBlock
      title="Navegación y Superficies"
      description="Estructuras de layout, paneles emergentes y jerarquía de contenido."
    >
      <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-md border border-border/60 bg-card/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Jerarquía de Navegación
          </p>
          <div className="space-y-6">
            <Breadcrumb className="min-w-0">
              <BreadcrumbList className="flex-wrap gap-1">
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Inicio</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Style Guide</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid h-9 w-full grid-cols-2 gap-1 p-1">
                <TabsTrigger value="overview" className="text-xs">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="config" className="text-xs">
                  Configuración
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="rounded-md border border-dashed border-border/80 p-4 text-center text-xs text-muted-foreground bg-background/30">
                  Panel de control principal de la vista
                </div>
              </TabsContent>
              <TabsContent value="config">
                <div className="rounded-md border border-dashed border-border/80 p-4 text-center text-xs text-muted-foreground bg-background/30">
                  Ajustes de visibilidad y filtros
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border border-border/60 bg-card/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Navegación Lateral (Sidebar)
          </p>
          <div className="isolate h-48 w-full overflow-hidden rounded-md border bg-background/50">
            <SidebarProvider className="h-full !min-h-0">
              <SidebarLocalPreview />
            </SidebarProvider>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border border-border/60 bg-card/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Overlays y Diálogos
          </p>
          <div className="grid grid-cols-3 gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Dialog
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <Button size="sm">Cerrar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Sheet
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Panel Lateral</SheetTitle>
                </SheetHeader>
              </SheetContent>
            </Sheet>

            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Drawer
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Detalle</DrawerTitle>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
          </div>
          <p className="text-[10px] text-muted-foreground mt-auto italic">
            Interfaces modales para interacción enfocada.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-md border border-border/60 bg-card/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Herramientas Contextuales
          </p>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    Dropdown
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-xs">
                  <DropdownMenuItem>Opción 1</DropdownMenuItem>
                  <DropdownMenuItem>Opción 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    Popover
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="text-xs w-48">
                  Contenido desplegable.
                </PopoverContent>
              </Popover>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    Tooltip
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-[10px]">
                  Ayuda rápida
                </TooltipContent>
              </Tooltip>
            </div>

            <ContextMenu>
              <ContextMenuTrigger className="flex h-16 items-center justify-center rounded-md border border-dashed border-border/80 bg-background/40 text-xs text-muted-foreground transition-colors hover:bg-background/20">
                Clic derecho aquí (Contexto)
              </ContextMenuTrigger>
              <ContextMenuContent className="text-xs">
                <ContextMenuItem>Copiar</ContextMenuItem>
                <ContextMenuItem>Mover</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </div>
      </div>
    </ShowcaseBlock>
  );
}

function SidebarLocalPreview() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="flex h-full w-full">
      <Sidebar
        collapsible="none"
        className={cn(
          "h-full border-r bg-card/30 transition-all duration-300 ease-in-out !min-w-0",
          isCollapsed ? "!w-12" : "!w-28",
        )}
      >
        <SidebarHeader
          className={cn(
            "border-b py-2 transition-all duration-300 flex flex-col",
            isCollapsed ? "items-center px-0" : "items-start px-3",
          )}
        >
          {!isCollapsed ? (
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
              Menú
            </p>
          ) : (
            <div className="size-4 rounded-full bg-primary/20" />
          )}
        </SidebarHeader>
        <SidebarContent className="overflow-hidden">
          <SidebarGroup className="p-1">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="sm"
                  tooltip="Dashboard"
                  className={cn(
                    "transition-all duration-300",
                    isCollapsed ? "justify-center px-0" : "gap-2 px-2",
                  )}
                >
                  <Sparkles className="size-3.5 shrink-0" />
                  {!isCollapsed && (
                    <span className="text-xs truncate">Inicio</span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="sm"
                  tooltip="Inbox"
                  className={cn(
                    "transition-all duration-300",
                    isCollapsed ? "justify-center px-0" : "gap-2 px-2",
                  )}
                >
                  <Inbox className="size-3.5 shrink-0" />
                  {!isCollapsed && (
                    <span className="text-xs truncate">Inbox</span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="!bg-transparent flex-1">
        <header className="flex h-8 items-center border-b px-2">
          <SidebarTrigger className="size-6" />
        </header>
        <div className="p-2">
          <div
            className={cn(
              "h-24 rounded-md bg-muted/10 border border-dashed border-border/40 transition-all duration-300",
              "flex items-center justify-center text-[10px] text-muted-foreground",
            )}
          >
            Content Area
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}
