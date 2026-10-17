import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/chart";

import { CHART_DATA } from "../../../../constants";
import { ComponentPreview } from "../../../component_preview";

export const ChartExample = () => (
  <ComponentPreview
    title="Chart"
    description="Convierte valores en patrones fáciles de comparar. Un solo color mantiene la atención en los datos; el tooltip permite consultar el detalle."
    className="md:col-span-2"
  >
    <figure className="space-y-5">
      <figcaption className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="font-medium">Proyectos completados</span>
        <span className="text-muted-foreground">
          Enero — Mayo · Datos de ejemplo
        </span>
      </figcaption>
      <ChartContainer
        config={{ total: { label: "Proyectos", color: "var(--primary)" } }}
        className="h-52 w-full"
      >
        <BarChart
          accessibilityLayer
          data={CHART_DATA}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            tick={{
              fontSize: "var(--font-size-sm)",
              fill: "var(--muted-foreground)",
            }}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)" }}
            content={<ChartTooltipContent hideIndicator />}
          />
          <Bar
            dataKey="total"
            fill="var(--color-total)"
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
            isAnimationActive={false}
          />
        </BarChart>
      </ChartContainer>
      <p className="sr-only">
        {CHART_DATA.map(({ month, total }) => month + ": " + total).join("; ")}{" "}
        proyectos completados.
      </p>
    </figure>
  </ComponentPreview>
);
