import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { AsyncCommandList } from "@/components/async_command_list";
import { Button } from "@/components/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/carousel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/chart";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/command";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/resizable";
import { ScrollArea } from "@/components/scroll_area";

import type { StyleGuideDemoItem } from "../types";
import { ShowcaseBlock } from "../showcase_block";

interface Props {
  asyncData: StyleGuideDemoItem[];
  selectedCommand: string | null;
  onSelectCommand: (id: string) => void;
  chartData: { month: string; total: number }[];
  chartConfig: ChartConfig;
}

export function DataListsSection({
  asyncData,
  selectedCommand,
  onSelectCommand,
  chartData,
  chartConfig,
}: Props) {
  return (
    <ShowcaseBlock
      title="Data, Listas y Composicion"
      description="Tablas, comandos, carruseles, paneles redimensionables y analitica."
    >
      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <div className="min-w-0 space-y-4 rounded-xl border p-4">
          <Command className="min-w-0 rounded-lg border">
            <CommandInput placeholder="Buscar comando..." />
            <CommandList>
              <CommandEmpty>Sin resultados</CommandEmpty>
              <CommandGroup heading="Sugerencias">
                <CommandItem>Nuevo expediente</CommandItem>
                <CommandItem>Crear factura</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>

          <Command className="min-w-0 rounded-lg border">
            <CommandInput placeholder="Async command list..." />
            <AsyncCommandList<StyleGuideDemoItem>
              data={asyncData}
              isLoading={false}
              getKey={(item) => item.id}
              renderItem={(item) => <span>{item.name}</span>}
              onSelect={onSelectCommand}
              emptyMessage="Sin elementos"
            />
          </Command>
          <p className="text-xs text-muted-foreground">
            Seleccionado: {selectedCommand ?? "ninguno"}
          </p>

          <ScrollArea className="h-40 rounded-md border">
            <div className="space-y-2 p-4">
              {Array.from({ length: 12 }).map((_, idx) => (
                <p key={idx} className="text-sm">
                  Registro de auditoria #{idx + 1}
                </p>
              ))}
            </div>
          </ScrollArea>

          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                Expandir detalle tecnico
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="rounded-md border p-3 text-sm text-muted-foreground">
              En este bloque se muestran metadatos de ejecucion sin saturar la
              interfaz principal.
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="min-w-0 space-y-4 rounded-xl border p-4">
          <div className="w-full min-w-0 max-w-full overflow-x-auto">
            <ChartContainer
              config={chartConfig}
              className="min-h-[220px] w-full min-w-[280px] max-w-full"
            >
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                <Bar dataKey="total" fill="var(--color-total)" radius={6} />
              </BarChart>
            </ChartContainer>
          </div>

          <ResizablePanelGroup
            direction="horizontal"
            className="h-36 min-w-0 max-w-full rounded-md border"
          >
            <ResizablePanel defaultSize={45}>
              <div className="flex h-full items-center justify-center bg-muted/40 text-sm">
                Panel A
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={55}>
              <div className="flex h-full items-center justify-center text-sm">
                Panel B
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>

          <div className="relative w-full min-w-0 max-w-full overflow-hidden px-12 py-2">
            <Carousel className="w-full min-w-0 max-w-full">
              <CarouselContent>
                {["A", "B", "C"].map((item) => (
                  <CarouselItem key={item}>
                    <div className="flex aspect-16/6 min-h-0 w-full items-center justify-center rounded-md border bg-muted/30 text-2xl font-serif">
                      {item}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        </div>
      </div>
    </ShowcaseBlock>
  );
}
