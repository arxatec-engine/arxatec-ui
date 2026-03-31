import { Inbox, Sparkles } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/context_menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown_menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tooltip";

import { ShowcaseBlock } from "../showcase_block";

export function NavigationSection() {
  return (
    <ShowcaseBlock
      title="Navegacion y Superficies"
      description="Estructuras de layout, paneles emergentes y jerarquia de contenido."
    >
      <div className="grid min-w-0 gap-6 xl:grid-cols-3">
        <div className="min-w-0 space-y-4 rounded-xl border p-4 xl:col-span-2">
          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="flex-wrap gap-1">
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Inicio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">UI</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Style Guide</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Tabs defaultValue="overview" className="min-w-0">
            <TabsList className="grid h-auto w-full min-w-0 grid-cols-3 gap-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="dialogs">Dialogs</TabsTrigger>
              <TabsTrigger value="menus">Menus</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-3">
              <Card>
                <CardContent className="pt-5">
                  <p className="text-sm text-muted-foreground">
                    Composicion base para vistas operativas.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="dialogs" className="min-w-0 space-y-3">
              <div className="flex min-w-0 flex-wrap gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar cambios</DialogTitle>
                      <DialogDescription>
                        Esta accion actualiza la configuracion activa.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancelar</Button>
                      <Button>Confirmar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Sheet</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Panel lateral</SheetTitle>
                      <SheetDescription>
                        Vista contextual para acciones rapidas.
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>

                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline">Drawer</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Detalle inferior</DrawerTitle>
                      <DrawerDescription>
                        Ideal para mobile y acciones paso a paso.
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline">Cerrar</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            </TabsContent>
            <TabsContent value="menus" className="min-w-0 space-y-3">
              <div className="flex min-w-0 flex-wrap gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Dropdown</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel>Cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Perfil</DropdownMenuItem>
                    <DropdownMenuItem>Configuracion</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Popover</Button>
                  </PopoverTrigger>
                  <PopoverContent className="text-sm">
                    Contenido tecnico contextual.
                  </PopoverContent>
                </Popover>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Tooltip</Button>
                  </TooltipTrigger>
                  <TooltipContent>Atajo rapido del sistema</TooltipContent>
                </Tooltip>
              </div>

              <ContextMenu>
                <ContextMenuTrigger className="flex h-24 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                  Clic derecho aqui
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Duplicar</ContextMenuItem>
                  <ContextMenuItem>Compartir</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem variant="destructive">Eliminar</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </TabsContent>
          </Tabs>
        </div>

        <div className="min-w-0 space-y-4 rounded-xl border p-4">
          <h3 className="font-serif text-2xl">Sidebar</h3>
          <div className="isolate h-72 min-h-0 w-full min-w-0 overflow-hidden rounded-md border">
            <SidebarProvider className="h-full !min-h-0 max-h-full min-w-0 max-w-full">
              <Sidebar>
                <SidebarHeader className="border-b px-3 py-2">Navegacion</SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>Principal</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <a href="#" className="flex items-center gap-2">
                              <Sparkles className="size-4" />
                              Inicio
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <a href="#" className="flex items-center gap-2">
                              <Inbox className="size-4" />
                              Bandeja
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
              <SidebarInset>
                <header className="flex h-10 items-center gap-2 border-b px-3">
                  <SidebarTrigger />
                  <p className="text-xs text-muted-foreground">Workspace</p>
                </header>
              </SidebarInset>
            </SidebarProvider>
          </div>
        </div>
      </div>
    </ShowcaseBlock>
  );
}
