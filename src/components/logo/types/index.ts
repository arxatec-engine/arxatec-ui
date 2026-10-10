export type LogoVariant = "arxatec" | "academy" | "management";

export interface LogoDefinition {
  viewBox: string;
  paths: string[];
  separator?: {
    cx: number;
    cy: number;
    r: number;
  };
}
