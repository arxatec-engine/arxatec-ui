export const HEADING_MENU_OPTIONS = [
  { value: "paragraph", label: "Párrafo", className: "font-normal" },
  { value: "1", label: "Título 1", className: "font-semibold" },
  { value: "2", label: "Título 2", className: "font-semibold" },
  { value: "3", label: "Título 3", className: "font-medium" },
  { value: "4", label: "Título 4", className: "font-medium" },
] as const;

/**
 * `DropdownMenuItem` reserva un hueco a la izquierda para el check de las
 * variantes seleccionables; aquí no hay check, así que se oculta ese span para
 * que el título no quede desplazado respecto al resto del menú.
 */
export const HEADING_MENU_ITEM_CLASS_NAME =
  "pl-2 pr-2 [&>span:first-child]:hidden flex w-full items-center justify-between gap-2";
