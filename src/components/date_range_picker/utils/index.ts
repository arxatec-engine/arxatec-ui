import { getDay } from "date-fns";

export const getNextWeekendDays = () => {
  const today = new Date();
  const currentDay = getDay(today);
  return (6 - currentDay + 7) % 7 || 7;
};
