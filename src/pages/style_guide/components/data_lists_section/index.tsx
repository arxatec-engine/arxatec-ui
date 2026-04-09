import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  AsyncCommandList,
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
} from "@/exports";
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
      title="Data, Listas y Composición"
      description="Herramientas de búsqueda, visualización analítica y estructuras dinámicas."
    >
      <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 items-stretch">
        <div className="flex flex-col gap-4 rounded-md border border-border/60 bg-card/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Control y Comandos
          </p>
          <div className="flex flex-col gap-4 h-full">
            <Command className="min-w-0 rounded-md border bg-background/50">
              <CommandInput
                placeholder="Acción rápida..."
                className="h-8 text-xs"
              />
              <CommandList className="max-h-24">
                <CommandEmpty className="py-2 text-[10px]">
                  Sin resultados
                </CommandEmpty>
                <CommandGroup heading="Sugerencias" className="text-[10px]">
                  <CommandItem className="text-xs">
                    Nuevo expediente
                  </CommandItem>
                  <CommandItem className="text-xs">Crear factura</CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>

            <div className="rounded-md border bg-background/30 p-2 h-full flex flex-col min-h-[180px]">
              <p className="mb-2 text-[10px] text-muted-foreground">
                Listado asíncrono:
              </p>
              <Command className="flex-1 overflow-hidden rounded-md border bg-background/50 min-h-[140px]">
                <AsyncCommandList<StyleGuideDemoItem>
                  data={asyncData}
                  isLoading={false}
                  getKey={(item) => item.id}
                  renderItem={(item) => (
                    <span className="text-xs">{item.name}</span>
                  )}
                  onSelect={onSelectCommand}
                  emptyMessage="Sin elementos"
                />
              </Command>
              <div className="mt-2 text-right">
                <p className="text-[10px] text-muted-foreground italic">
                  ID:{" "}
                  <span className="text-primary font-mono">
                    {selectedCommand ?? "null"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 rounded-md border border-border/60 bg-card/20 p-5 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              Registro de Auditoría
            </p>
            <div className="flex flex-col gap-3 h-full">
              <ScrollArea className="flex-1 min-h-[120px] rounded-md border bg-background/30">
                <div className="divide-y divide-border/20 px-3">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2.5"
                    >
                      <p className="text-[11px] text-muted-foreground">
                        Log {idx + 1}
                      </p>
                      <span className="text-[9px] text-muted-foreground/60 font-mono">
                        18:58:0{idx}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-[10px] h-7 bg-background/40"
                  >
                    DETALLE TÉCNICO
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 rounded-md border border-dashed p-3 text-[10px] text-muted-foreground leading-relaxed bg-background/20">
                  Logs del servidor y sincronización.
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-md border border-border/60 bg-card/20 p-5 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              Distribución y Composición
            </p>
            <div className="space-y-4 h-full flex flex-col">
              <ResizablePanelGroup
                direction="horizontal"
                className="h-[100px] rounded-md border bg-background/40"
              >
                <ResizablePanel defaultSize={40}>
                  <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                    Panel A
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={60}>
                  <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground bg-muted/10">
                    Panel B
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>

              <div className="relative px-8 flex-1 flex flex-col justify-center">
                <Carousel className="w-full">
                  <CarouselContent>
                    {["1", "2", "3"].map((item) => (
                      <CarouselItem key={item}>
                        <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-border/60 bg-background/10 text-lg font-serif text-muted-foreground/40">
                          Layer {item}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="size-6 -left-6" />
                  <CarouselNext className="size-6 -right-6" />
                </Carousel>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border border-border/60 bg-card/20 p-5 md:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              Análisis de Rendimiento
            </p>
            <p className="text-[10px] font-mono text-primary">Live Data</p>
          </div>
          <div className="w-full min-w-0 overflow-hidden px-1">
            <ChartContainer
              config={chartConfig}
              className="min-h-[160px] w-full"
            >
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  strokeOpacity={0.2}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  fontSize={10}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideIndicator
                      className="text-[10px]"
                    />
                  }
                />
                <Bar
                  dataKey="total"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ChartContainer>
          </div>
          <div className="flex justify-center border-t border-border/40 pt-3">
            <p className="text-[10px] text-muted-foreground text-center">
              Dashboard unificado de métricas operativas
            </p>
          </div>
        </div>
      </div>
    </ShowcaseBlock>
  );
}
