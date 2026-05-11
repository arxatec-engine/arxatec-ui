import { ImageExtension, ImagePlaceholder } from "../extensions";
import SearchAndReplace from "../extensions/search_and_replace";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, FontFamily, FontSize } from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell as BaseTableCell } from "@tiptap/extension-table-cell";
import { TableHeader as BaseTableHeader } from "@tiptap/extension-table-header";
import { TableSideControls } from "../extensions/table_side_controls";
import Collaboration from "@tiptap/extension-collaboration";
import { NodeRange } from "@tiptap/extension-node-range";
import * as Y from "yjs";
import Placeholder from "@tiptap/extension-placeholder";
import BaseImage from "@tiptap/extension-image";
import type { AnyExtension } from "@tiptap/core";

const ImageImportExtension = BaseImage.extend({
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: "100%",
      },
      height: {
        default: null,
      },
      align: {
        default: "center",
      },
      caption: {
        default: "",
      },
      aspectRatio: {
        default: null,
      },
    };
  },
});

const placeholderExtension = Placeholder.configure({
  emptyNodeClass: "is-editor-empty",
  placeholder: ({ node }) => {
    switch (node.type.name) {
      case "heading":
        return `Encabezado ${node.attrs.level}`;
      case "detailsSummary":
        return "Título de sección";
      case "codeBlock":
        return "";
      default:
        return "Escribe algo, escribe '/' para comandos";
    }
  },
  includeChildren: false,
});

const starterKitExtension = StarterKit.configure({
  undoRedo: false,
  orderedList: {
    HTMLAttributes: {
      class: "list-decimal",
    },
  },
  bulletList: {
    HTMLAttributes: {
      class: "list-disc",
    },
  },
  heading: {
    levels: [1, 2, 3, 4],
  },
});

const TableCell = BaseTableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      color: {
        default: null,
        parseHTML: (element) => element.style.color || null,
        renderHTML: (attributes) =>
          attributes.color ? { style: `color: ${attributes.color}` } : {},
      },
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.style.backgroundColor || null,
        renderHTML: (attributes) =>
          attributes.backgroundColor
            ? { style: `background-color: ${attributes.backgroundColor}` }
            : {},
      },
    };
  },
});

const TableHeader = BaseTableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      color: {
        default: null,
        parseHTML: (element) => element.style.color || null,
        renderHTML: (attributes) =>
          attributes.color ? { style: `color: ${attributes.color}` } : {},
      },
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.style.backgroundColor || null,
        renderHTML: (attributes) =>
          attributes.backgroundColor
            ? { style: `background-color: ${attributes.backgroundColor}` }
            : {},
      },
    };
  },
});

const tableExtensions: AnyExtension[] = [
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  TableSideControls,
];

export function createRichTextEditorExtensions(ydoc: Y.Doc): AnyExtension[] {
  return [
    Collaboration.configure({
      document: ydoc,
    }),
    NodeRange,
    starterKitExtension,
    placeholderExtension,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    TextStyle,
    FontFamily,
    FontSize,
    Subscript,
    Superscript,
    Underline,
    Link,
    Color,
    Highlight.configure({
      multicolor: true,
    }),
    ImageExtension,
    ImagePlaceholder,
    SearchAndReplace,
    Typography,
    ...tableExtensions,
  ];
}

export function createRichTextEditorImportExtensions(): AnyExtension[] {
  return [
    NodeRange,
    starterKitExtension,
    placeholderExtension,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    TextStyle,
    FontFamily,
    FontSize,
    Subscript,
    Superscript,
    Underline,
    Link,
    Color,
    Highlight.configure({
      multicolor: true,
    }),
    ImageImportExtension,
    Typography,
    ...tableExtensions,
  ];
}
