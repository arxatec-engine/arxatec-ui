import { getNextWeekendDays } from "../utils";

export const QUICK_DATE_OPTIONS = [
  { label: "Mañana", days: 1 },
  { label: "Próxima semana", days: 7 },
  { label: "Próximo fin de semana", days: getNextWeekendDays() },
  { label: "2 semanas", days: 14 },
  { label: "3 semanas", days: 21 },
  { label: "1 mes", days: 28 },
  { label: "2 meses", days: 56 },
  { label: "6 meses", days: 168 },
  { label: "1 año", days: 365 },
];
