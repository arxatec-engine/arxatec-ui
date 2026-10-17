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
import { AppleIsotype } from "@/components/icons/components/apple_isotype";
import { GoogleIsotype } from "@/components/icons/components/google_isotype";
import { MicrosoftIsotype } from "@/components/icons/components/microsoft_isotype";
import { Isotype } from "@/components/isotype";
import { Logo } from "@/components/logo";
import {
  GoogleCalendarIsotype,
  GoogleDriveIsotype,
  OneDriveIsotype,
  OutlookCalendarIsotype,
} from "@/exports/provider-icons";

import { ComponentPreview } from "../../../component_preview";

export const IdentityExamples = () => (
  <>
    <ComponentPreview
      title="Logo · Isotype"
      description="El logotipo identifica la marca cuando hay espacio. El isotipo conserva su reconocimiento en espacios pequeños."
    >
      <div className="flex flex-wrap items-center justify-center gap-8 py-5">
        <span role="img" aria-label="Isotipo de Arxatec">
          <Isotype className="size-12" />
        </span>
        <span className="h-10 border-l" aria-hidden="true" />
        <span role="img" aria-label="Arxatec">
          <Logo className="h-8 w-auto max-w-full" />
        </span>
      </div>
    </ComponentPreview>
    <ComponentPreview
      title="ProviderIcons"
      description="Los símbolos originales de cada servicio ayudan a reconocer integraciones y reducen la ambigüedad al conectar una cuenta."
    >
      <div className="flex flex-wrap items-center justify-center gap-7">
        <GoogleDriveIsotype
          className="size-8"
          aria-hidden="false"
          role="img"
          aria-label="Google Drive"
        />
        <OneDriveIsotype
          className="size-8"
          aria-hidden="false"
          role="img"
          aria-label="OneDrive"
        />
        <GoogleCalendarIsotype
          className="size-8"
          aria-hidden="false"
          role="img"
          aria-label="Google Calendar"
        />
        <OutlookCalendarIsotype
          className="size-8"
          aria-hidden="false"
          role="img"
          aria-label="Outlook Calendar"
        />
      </div>
    </ComponentPreview>
    <ComponentPreview
      title="Isotipos de proveedores"
      description="Identifican al proveedor en accesos e integraciones. Acompaña cada símbolo con el nombre del servicio en las acciones de conexión."
    >
      <div className="flex items-center justify-center gap-8">
        <span role="img" aria-label="Google">
          <GoogleIsotype className="size-8" />
        </span>
        <span role="img" aria-label="Microsoft">
          <MicrosoftIsotype className="size-8" />
        </span>
        <span role="img" aria-label="Apple">
          <AppleIsotype className="size-8" />
        </span>
      </div>
    </ComponentPreview>
    <ComponentPreview
      title="AnimatedIcons"
      description="Añaden una respuesta sutil al pasar el cursor. Conservan el tamaño y el trazo de la iconografía para acompañar una acción sin distraer."
    >
      <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
        <SearchIcon size={22} role="img" aria-label="Buscar" />
        <UsersIcon size={22} role="img" aria-label="Equipo" />
        <FoldersIcon size={22} role="img" aria-label="Archivos" />
        <LayersIcon size={22} role="img" aria-label="Capas" />
        <SlidersHorizontalIcon size={22} role="img" aria-label="Ajustes" />
        <CalendarDaysIcon size={22} role="img" aria-label="Calendario" />
        <ChartPieIcon size={22} role="img" aria-label="Gráfico" />
        <CircleHelpIcon size={22} role="img" aria-label="Ayuda" />
        <PanelLeftCloseIcon size={22} role="img" aria-label="Contraer panel" />
        <PanelLeftOpenIcon size={22} role="img" aria-label="Expandir panel" />
        <SparklesIcon size={22} role="img" aria-label="Novedades" />
      </div>
    </ComponentPreview>
  </>
);
