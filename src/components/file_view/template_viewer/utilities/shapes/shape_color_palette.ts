export const SHAPE_COLOR_PALETTE = [
  { name: "Transparente", value: "transparent" },
  { name: "Blanco", value: "#FFFFFF" },
  { name: "Negro", value: "#000000" },
  { name: "Rojo", value: "#F44336" },
  { name: "Rosa", value: "#E91E63" },
  { name: "Púrpura", value: "#9C27B0" },
  { name: "Azul", value: "#2196F3" },
  { name: "Cian", value: "#00BCD4" },
  { name: "Verde", value: "#4CAF50" },
  { name: "Amarillo", value: "#FFEB3B" },
  { name: "Naranja", value: "#FF5722" },
  { name: "Marrón", value: "#795548" },
  { name: "Gris claro", value: "#E0E0E0" },
  { name: "Gris", value: "#9E9E9E" },
  { name: "Gris oscuro", value: "#424242" },
] as const;

export type ShapeColorValue = (typeof SHAPE_COLOR_PALETTE)[number]["value"];
