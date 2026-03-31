import { AlertTriangle, CalendarCheck2 } from "lucide-react";
import { toast } from "sonner";

import {
  CalendarDaysIcon,
  ChartPieIcon,
  CircleHelpIcon,
  FoldersIcon,
  LayersIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  UsersIcon,
} from "@/components/animated_icons";
import { AsyncBoundary } from "@/components/async_boundary";
import { Button } from "@/components/button";
import {
  GoogleDriveIcon,
  GoogleIsotype,
  MicrosoftIsotype,
  OneDriveIcon,
} from "@/components/icons";
import { Isotype } from "@/components/isotype";
import { LoaderSplash } from "@/components/loader_splash";
import { Logo } from "@/components/logo";
import { Skeleton } from "@/components/skeleton";
import { StatusMessage } from "@/components/status_message";

import { ShowcaseBlock } from "../showcase_block";

export function BrandingFeedbackSection() {
  return (
    <ShowcaseBlock
      title="Branding, Feedback y Estados"
      description="Identidad visual, iconografia, mensajes de estado y loaders."
    >
      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-4 rounded-xl border p-4">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <Isotype className="size-10 shrink-0 text-primary" />
            <Logo className="h-7 min-w-0 max-w-full shrink text-foreground" />
          </div>
          <div className="grid grid-cols-4 gap-4 text-muted-foreground">
            <GoogleIsotype className="size-8" />
            <MicrosoftIsotype className="size-8" />
            <GoogleDriveIcon className="size-8" />
            <OneDriveIcon className="size-8" />
          </div>
          <div className="flex flex-wrap gap-3 text-primary">
            <UsersIcon />
            <SearchIcon />
            <LayersIcon />
            <FoldersIcon />
            <SlidersHorizontalIcon />
            <ChartPieIcon />
            <CalendarDaysIcon />
            <CircleHelpIcon />
            <PanelLeftCloseIcon />
            <PanelLeftOpenIcon />
            <SparklesIcon />
          </div>
        </div>

        <div className="min-w-0 space-y-4 rounded-xl border p-4">
          <StatusMessage
            title="Sincronizacion en riesgo"
            description="Detectamos inconsistencia en 3 registros."
            color="rose"
            icon={AlertTriangle}
          />
          <StatusMessage
            title="Todo correcto"
            description="No hay pendientes por revisar."
            color="white"
            icon={CalendarCheck2}
          />
          <div className="flex min-w-0 flex-wrap gap-2">
            <Button
              size="sm"
              className="shrink-0"
              onClick={() => toast.success("Guardado correctamente")}
            >
              Toast exito
            </Button>
            <Button
              size="sm"
              className="shrink-0"
              variant="outline"
              onClick={() => toast.info("Nueva notificacion")}
            >
              Toast info
            </Button>
          </div>
        </div>

        <div className="min-w-0 space-y-4 rounded-xl border p-4">
          <div className="relative flex h-44 w-full overflow-hidden rounded-md border bg-background">
            <div className="pointer-events-none absolute left-1/2 top-1/2 flex origin-center -translate-x-1/2 -translate-y-1/2 scale-[0.28] items-center justify-center">
              <LoaderSplash />
            </div>
          </div>
          <AsyncBoundary
            isLoading={false}
            isError={false}
            data={{ message: "Contenido listo para renderizar" }}
            LoadingComponent={<Skeleton className="h-10 w-full" />}
            ErrorComponent={<p className="text-sm text-destructive">Error</p>}
          >
            {(d: { message: string }) => (
              <p className="text-sm text-muted-foreground">{d.message}</p>
            )}
          </AsyncBoundary>
        </div>
      </div>
    </ShowcaseBlock>
  );
}
