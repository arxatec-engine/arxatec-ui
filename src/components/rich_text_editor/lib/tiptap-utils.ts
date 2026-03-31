import { Editor } from "@tiptap/core";
import { Selection, NodeSelection } from "@tiptap/pm/state";

/**
 * Gets the bounding rectangle of the current selection in the editor.
 * Uses the native DOM selection for more reliable results with portaled elements.
 */
export const getSelectionBoundingRect = (editor: Editor): DOMRect | null => {
  try {
    const selection = window.getSelection();
    const { view, state } = editor;

    if (!selection || selection.rangeCount === 0) {
      const { from } = state.selection;
      const coords = view.coordsAtPos(from);
      return new DOMRect(
        coords.left,
        coords.top,
        0,
        coords.bottom - coords.top
      );
    }

    const range = selection.getRangeAt(0);

    // Check if selection is actually inside the editor
    const editorElement = view.dom;
    if (!editorElement.contains(range.commonAncestorContainer)) {
      const { from } = state.selection;
      const coords = view.coordsAtPos(from);
      return new DOMRect(
        coords.left,
        coords.top,
        0,
        coords.bottom - coords.top
      );
    }

    const rect = range.getBoundingClientRect();

    // If the rect is empty (e.g., collapsed selection), try to get coordinates
    if (rect.width === 0 && rect.height === 0) {
      const { from } = state.selection;
      const coords = view.coordsAtPos(from);
      return new DOMRect(
        coords.left,
        coords.top,
        0,
        coords.bottom - coords.top
      );
    }

    return rect;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null;
  }
};

/**
 * Checks if the current selection is valid for showing floating elements.
 */
export const isSelectionValid = (
  editor: Editor,
  selection?: Selection,
  excludedNodeTypes: string[] = ["imageUpload", "horizontalRule"]
): boolean => {
  const sel = selection || editor.state.selection;
  if (!sel || sel.empty) return false;

  // Check if it's a node selection (like an image)
  if (sel instanceof NodeSelection) {
    return false;
  }

  // Check if selection is within excluded node types
  const { $from, $to } = sel;
  const nodes: string[] = [];
  editor.state.doc.nodesBetween($from.pos, $to.pos, (node) => {
    nodes.push(node.type.name);
  });

  if (nodes.some((name) => excludedNodeTypes.includes(name))) return false;
  if (nodes.includes("codeBlock")) return false;

  return true;
};

/**
 * Checks if the current text selection is valid for editing.
 */
export const isTextSelectionValid = (editor: Editor): boolean => {
  const { selection } = editor.state;
  if (!selection || selection.empty) return false;

  const { $from, $to } = selection;
  const nodes: string[] = [];
  editor.state.doc.nodesBetween($from.pos, $to.pos, (node) => {
    nodes.push(node.type.name);
  });

  return !nodes.includes("codeBlock");
};
