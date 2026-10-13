import { es } from "date-fns/locale";
import type { Locale } from "date-fns";
import { createContext, type ReactNode } from "react";
import { HEX_COLOR_SWATCHES } from "../../hex_color_picker/utils";

export interface EditableFieldLabels {
  empty: string;
  hint: string;
  hours: string;
  minutes: string;
  saving: string;
  saved: string;
  savedAgo: string;
  offline: string;
  genericError: string;
  retry: string;
  acceptColor: string;
  clearColor: string;
  selectColor: string;
  changeColor: string;
  currentColor: string;
}

export interface EditableFieldsConfig {
  labels: EditableFieldLabels;
  locale: Locale;
  dateFormat: string;
  tableDateFormat: string;
  swatches: readonly string[];
}

export interface EditableFieldsProviderProps extends Partial<
  Omit<EditableFieldsConfig, "labels">
> {
  labels?: Partial<EditableFieldLabels>;
  children: ReactNode;
}

const defaults: EditableFieldsConfig = {
  labels: {
    empty: "Añadir…",
    hint: "Enter para guardar · Esc para descartar",
    hours: "Horas",
    minutes: "Minutos",
    saving: "Guardando…",
    saved: "Guardado",
    savedAgo: "Guardado hace un momento",
    offline: "Sin conexión · se guardará al reconectar",
    genericError: "No se pudo guardar el cambio. Revisa tu conexión.",
    retry: "Reintentar",
    acceptColor: "Aceptar",
    clearColor: "Quitar color",
    selectColor: "Seleccionar color",
    changeColor: "Cambiar color",
    currentColor: "actual",
  },
  locale: es,
  dateFormat: "dd 'de' MMMM 'del' yyyy",
  tableDateFormat: "dd MMM yyyy",
  swatches: HEX_COLOR_SWATCHES,
};

export const EditableFieldsContext =
  createContext<EditableFieldsConfig>(defaults);
