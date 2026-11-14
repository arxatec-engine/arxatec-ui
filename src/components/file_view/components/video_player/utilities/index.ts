export const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor(seconds / 60) % 60;
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return hours > 0
    ? `${hours}:${mins.toString().padStart(2, "0")}:${secs}`
    : `${mins}:${secs}`;
};
