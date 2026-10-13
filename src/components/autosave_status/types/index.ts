export type AutosaveFieldState =
  | "idle"
  | "dirty"
  | "saving"
  | "saved"
  | "error";

export type AutosaveStatusValue = AutosaveFieldState | "offline";
