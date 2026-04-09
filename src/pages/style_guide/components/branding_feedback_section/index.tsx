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
  AsyncBoundary,
  Button,
  GoogleDriveIcon,
  GoogleIsotype,
  MicrosoftIsotype,
  OneDriveIcon,
  Isotype,
  LoaderSplash,
  Logo,
  Skeleton,
  StatusMessage,
} from "@/exports";
import { ShowcaseBlock } from "../showcase_block";

export function BrandingFeedbackSection() {
  return (
    <ShowcaseBlock
      title="Branding, Feedback y Estados"
      description="Identidad visual, iconografia, mensajes de estado y loaders."
    >
      <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-5 rounded-md border border-border/80 bg-card/30 p-5">
          <div className="flex items-center gap-4">
            <Isotype className="size-10 shrink-0 text-primary" />
            <Logo className="h-7 shrink text-foreground" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4 text-muted-foreground/60">
            <GoogleIsotype className="size-7" />
            <MicrosoftIsotype className="size-7" />
            <GoogleDriveIcon className="size-7" />
            <OneDriveIcon className="size-7" />
          </div>

          <div className="flex flex-wrap gap-4 border-t pt-5 text-primary/90">
            <UsersIcon className="size-5" />
            <SearchIcon className="size-5" />
            <LayersIcon className="size-5" />
            <FoldersIcon className="size-5" />
            <SlidersHorizontalIcon className="size-5" />
            <ChartPieIcon className="size-5" />
            <CalendarDaysIcon className="size-5" />
            <CircleHelpIcon className="size-5" />
            <PanelLeftCloseIcon className="size-5" />
            <PanelLeftOpenIcon className="size-5" />
            <SparklesIcon className="size-5" />
          </div>
        </div>

        <div className="flex flex-col gap-5 rounded-md border border-border/80 bg-card/30 p-5">
          <div className="space-y-3">
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
          </div>

          <div className="flex flex-wrap gap-2 border-t pt-5">
            <Button
              size="sm"
              onClick={() => toast.success("Guardado correctamente")}
            >
              Toast exito
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info("Nueva notificacion")}
            >
              Toast info
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-5 rounded-md border border-border/80 bg-card/30 p-5">
          <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border border-border/40 bg-background/50">
            <div className="scale-[0.22]">
              <LoaderSplash />
            </div>
          </div>

          <div className="border-t pt-5">
            <AsyncBoundary
              isLoading={false}
              isError={false}
              data={{ message: "Contenido listo para renderizar" }}
              LoadingComponent={<Skeleton className="h-10 w-full" />}
              ErrorComponent={<p className="text-sm text-destructive">Error</p>}
            >
              {(d: { message: string }) => (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{d.message}</p>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                  <Skeleton className="h-1.5 w-2/3 rounded-full" />
                </div>
              )}
            </AsyncBoundary>
          </div>
        </div>
      </div>
    </ShowcaseBlock>
  );
}
