export type LogoVariant = "arxatec" | "academy" | "management" | "design";

export interface LogoDefinition {
  viewBox: string;
  paths: string[];
  separator?: {
    cx: number;
    cy: number;
    r: number;
  };
}
