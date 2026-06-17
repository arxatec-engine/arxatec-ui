export type ShapeDrawTool = "line" | "rect" | "ellipse";

export function isShapeDrawTool(
  tool: ShapeDrawTool | null,
): tool is ShapeDrawTool {
  return tool === "line" || tool === "rect" || tool === "ellipse";
}
