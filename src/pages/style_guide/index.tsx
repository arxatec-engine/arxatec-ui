import { useEffect, useMemo, useState } from "react";

import type { IconName } from "@/components/icon_picker";
import type { LocationData } from "@/components/map_picker";
import { Toaster } from "@/components/sonner";
import { TooltipProvider } from "@/components/tooltip";
import type { ChartConfig } from "@/components/chart";
import type { Pagination as PaginationType } from "@/types";

import {
  BrandingFeedbackSection,
  DataListsSection,
  FormsSection,
  HeroSection,
  MediaGeoSection,
  NavigationSection,
  StyleGuideFooter,
  TablesPaginationSection,
  type StyleGuideDemoItem,
} from "./components";

function StyleGuide() {
  const [isDark, setIsDark] = useState(true);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [asyncValue, setAsyncValue] = useState<string | undefined>();
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  const [iconValue, setIconValue] = useState<IconName | undefined>("sparkles");
  const [files, setFiles] = useState<File[]>([]);
  const [cropOpen, setCropOpen] = useState(false);
  const [location, setLocation] = useState<LocationData | undefined>({
    lat: 19.4326,
    lng: -99.1332,
    address: "Ciudad de Mexico, CDMX",
  });
  const [pagination, setPagination] = useState<PaginationType>({
    page: 2,
    limit: 10,
    total: 87,
    total_pages: 9,
  });

  const asyncData = useMemo<StyleGuideDemoItem[]>(
    () => [
      { id: "design", name: "Design System" },
      { id: "infra", name: "Infraestructura" },
      { id: "billing", name: "Facturacion" },
    ],
    []
  );

  const chartData = useMemo(
    () => [
      { month: "Ene", total: 120 },
      { month: "Feb", total: 220 },
      { month: "Mar", total: 160 },
      { month: "Abr", total: 280 },
      { month: "May", total: 230 },
    ],
    []
  );

  const chartConfig = {
    total: {
      label: "Total",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const nextPage = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(Math.max(1, page), prev.total_pages),
    }));
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <Toaster position="bottom-right" />

        <div className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(circle_at_10%_20%,hsl(var(--primary))_0%,transparent_35%),radial-gradient(circle_at_80%_0%,hsl(var(--accent))_0%,transparent_30%)]" />

        <main className="relative mx-auto flex w-full min-w-0 max-w-4xl flex-col gap-8 overflow-x-hidden px-6 py-10 lg:px-10">
          <HeroSection isDark={isDark} onDarkChange={setIsDark} />
          <BrandingFeedbackSection />
          <FormsSection
            startDate={startDate}
            dueDate={dueDate}
            onStartDateChange={setStartDate}
            onDueDateChange={setDueDate}
            asyncValue={asyncValue}
            onAsyncValueChange={setAsyncValue}
            asyncOptions={asyncData}
          />
          <NavigationSection />
          <DataListsSection
            asyncData={asyncData}
            selectedCommand={selectedCommand}
            onSelectCommand={setSelectedCommand}
            chartData={chartData}
            chartConfig={chartConfig}
          />
          <MediaGeoSection
            iconValue={iconValue}
            onIconChange={setIconValue}
            files={files}
            onFilesChange={setFiles}
            cropOpen={cropOpen}
            onCropOpenChange={setCropOpen}
            location={location}
            onLocationChange={setLocation}
          />
          <TablesPaginationSection
            pagination={pagination}
            onSetPage={nextPage}
          />
          <StyleGuideFooter />
        </main>
      </div>
    </TooltipProvider>
  );
}

export default StyleGuide;
