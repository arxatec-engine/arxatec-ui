/**
 * Centinela de la opción "todos": `SelectItem` de Radix no admite `value=""`,
 * así que la ausencia de filtro viaja como un valor propio y se traduce a
 * `undefined` al notificar al consumidor.
 */
export const ALL_VALUE = "all";
