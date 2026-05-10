import { Extension } from "@tiptap/core";
import { Plugin, PluginKey, type EditorState } from "@tiptap/pm/state";
import { CellSelection, findCellPos } from "@tiptap/pm/tables";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { TableCellMenu } from "./table_cell_menu";

const TABLE_SIDE_CONTROLS_PLUGIN_KEY = new PluginKey<number | null>(
  "tableSideControls"
);
const BUTTON_OFFSET_PX = 4;
const HIDE_DELAY_MS = 500;
const CONTROL_SAFE_AREA_PX = 24;
const CELL_ACTION_BUTTON_WIDTH_PX = 12;

function isHTMLElement(target: EventTarget | null): target is HTMLElement {
  return target instanceof HTMLElement;
}

function getHTMLElement(target: EventTarget | null): HTMLElement | null {
  if (target instanceof HTMLElement) {
    return target;
  }

  if (target instanceof Text) {
    return target.parentElement;
  }

  if (target instanceof Element) {
    return target as HTMLElement;
  }

  return null;
}

function getSelectedCellPos(state: EditorState) {
  if (state.selection instanceof CellSelection) {
    return null;
  }

  const $cell = findCellPos(state.doc, state.selection.from);
  const cell = $cell ? state.doc.nodeAt($cell.pos) : null;

  if (
    !cell ||
    (cell.type.name !== "tableCell" && cell.type.name !== "tableHeader")
  ) {
    return null;
  }

  return $cell?.pos ?? null;
}

export const TableSideControls = Extension.create({
  name: "tableSideControls",

  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        key: TABLE_SIDE_CONTROLS_PLUGIN_KEY,
        state: {
          init: (_config, state) => getSelectedCellPos(state),
          apply: (_transaction, _value, _oldState, newState) =>
            getSelectedCellPos(newState),
        },
        props: {
          decorations: (state) => {
            if (!editor.isEditable || !editor.isFocused) {
              return null;
            }

            const cellPos = TABLE_SIDE_CONTROLS_PLUGIN_KEY.getState(state);
            if (typeof cellPos !== "number") {
              return null;
            }

            const cell = state.doc.nodeAt(cellPos);

            if (!cell) {
              return null;
            }

            return DecorationSet.create(state.doc, [
              Decoration.node(cellPos, cellPos + cell.nodeSize, {
                class: "table-side-controls-selected-cell",
              }),
            ]);
          },
        },
        view: (view) => {
          const doc = view.dom.ownerDocument;
          const rowButton = doc.createElement("button");
          rowButton.type = "button";
          rowButton.className = "table-side-controls-add-row";
          rowButton.setAttribute(
            "aria-label",
            "Agregar fila debajo de la tabla"
          );
          rowButton.textContent = "+";

          const columnButton = doc.createElement("button");
          columnButton.type = "button";
          columnButton.className = "table-side-controls-add-column";
          columnButton.setAttribute(
            "aria-label",
            "Agregar columna al final de la tabla"
          );
          columnButton.textContent = "+";

          const cellButton = doc.createElement("button");
          cellButton.type = "button";
          cellButton.className = "table-side-controls-cell-action";
          cellButton.setAttribute("aria-label", "Opciones de celda");
          cellButton.textContent = "⋮";

          const multiCellOverlay = doc.createElement("div");
          multiCellOverlay.className =
            "table-side-controls-multi-cell-selection";

          const cellMenu = doc.createElement("div");
          cellMenu.className = "table-cell-menu";
          let cellMenuRoot: Root | null = null;

          let isRowButtonVisible = false;
          let isColumnButtonVisible = false;
          let isCellButtonVisible = false;
          let isCellMenuVisible = false;
          let currentRowTable: HTMLTableElement | null = null;
          let currentColumnTable: HTMLTableElement | null = null;
          let currentRow: HTMLTableRowElement | null = null;
          let currentColumnCell: HTMLTableCellElement | null = null;
          let hideTimeout: ReturnType<typeof window.setTimeout> | null = null;
          let renderCellMenu = () => {};

          const cancelScheduledHide = () => {
            if (!hideTimeout) return;
            window.clearTimeout(hideTimeout);
            hideTimeout = null;
          };

          const hideRowButton = () => {
            if (!isRowButtonVisible) return;
            isRowButtonVisible = false;
            currentRowTable = null;
            currentRow = null;
            rowButton.style.display = "none";
          };

          const hideColumnButton = () => {
            if (!isColumnButtonVisible) return;
            isColumnButtonVisible = false;
            currentColumnTable = null;
            currentColumnCell = null;
            columnButton.style.display = "none";
          };

          const hideCellButton = () => {
            if (!isCellButtonVisible) return;
            isCellButtonVisible = false;
            cellButton.style.display = "none";
          };

          const hideCellMenu = () => {
            if (!isCellMenuVisible) return;
            isCellMenuVisible = false;
            cellMenu.style.display = "none";
            renderCellMenu();
          };

          const hideMultiCellOverlay = () => {
            multiCellOverlay.style.display = "none";
          };

          const hideButtons = () => {
            cancelScheduledHide();
            hideRowButton();
            hideColumnButton();
          };

          const scheduleHideButtons = () => {
            cancelScheduledHide();
            hideTimeout = window.setTimeout(() => {
              hideTimeout = null;
              hideButtons();
            }, HIDE_DELAY_MS);
          };

          const showRowButton = (
            table: HTMLTableElement,
            row: HTMLTableRowElement
          ) => {
            const tableRect = table.getBoundingClientRect();
            const rowRect = row.getBoundingClientRect();

            if (tableRect.width <= 0 || rowRect.bottom <= 0) {
              hideRowButton();
              return;
            }

            rowButton.style.display = "flex";
            rowButton.style.left = `${Math.round(tableRect.left)}px`;
            rowButton.style.top = `${Math.round(
              rowRect.bottom + BUTTON_OFFSET_PX
            )}px`;
            rowButton.style.width = `${Math.round(tableRect.width)}px`;

            currentRowTable = table;
            currentRow = row;
            isRowButtonVisible = true;
          };

          const showColumnButton = (
            table: HTMLTableElement,
            cell: HTMLTableCellElement
          ) => {
            const tableRect = table.getBoundingClientRect();

            if (tableRect.height <= 0 || tableRect.right <= 0) {
              hideColumnButton();
              return;
            }

            columnButton.style.display = "flex";
            columnButton.style.left = `${Math.round(
              tableRect.right + BUTTON_OFFSET_PX
            )}px`;
            columnButton.style.top = `${Math.round(tableRect.top)}px`;
            columnButton.style.height = `${Math.round(tableRect.height)}px`;

            currentColumnTable = table;
            currentColumnCell = cell;
            isColumnButtonVisible = true;
          };

          const isControlButton = (target: EventTarget | null) => {
            const element = getHTMLElement(target);
            const isDropdownMenuElement =
              !!element &&
              !!element.closest(
                "[data-slot='dropdown-menu-content'], [data-slot='dropdown-menu-sub-content']"
              );

            return (
              !!element &&
              (rowButton.contains(element) ||
                columnButton.contains(element) ||
                cellButton.contains(element) ||
                cellMenu.contains(element) ||
                isDropdownMenuElement)
            );
          };

          const isPointInsideRect = (
            event: MouseEvent,
            rect: DOMRect,
            padding = 0
          ) => {
            return (
              event.clientX >= rect.left - padding &&
              event.clientX <= rect.right + padding &&
              event.clientY >= rect.top - padding &&
              event.clientY <= rect.bottom + padding
            );
          };

          const isPointerNearActiveControl = (event: MouseEvent) => {
            if (isRowButtonVisible && currentRowTable) {
              const tableRect = currentRowTable.getBoundingClientRect();
              const buttonRect = rowButton.getBoundingClientRect();

              if (
                isPointInsideRect(event, tableRect, CONTROL_SAFE_AREA_PX) ||
                isPointInsideRect(event, buttonRect, CONTROL_SAFE_AREA_PX)
              ) {
                return true;
              }
            }

            if (isColumnButtonVisible && currentColumnTable) {
              const tableRect = currentColumnTable.getBoundingClientRect();
              const buttonRect = columnButton.getBoundingClientRect();

              if (
                isPointInsideRect(event, tableRect, CONTROL_SAFE_AREA_PX) ||
                isPointInsideRect(event, buttonRect, CONTROL_SAFE_AREA_PX)
              ) {
                return true;
              }
            }

            return false;
          };

          const updateButtonFromEvent = (event: MouseEvent) => {
            cancelScheduledHide();

            if (!editor.isEditable) {
              hideButtons();
              return;
            }

            if (isControlButton(event.target)) {
              return;
            }

            const targetElement = getHTMLElement(event.target);

            if (!targetElement) {
              if (isPointerNearActiveControl(event)) {
                return;
              }

              scheduleHideButtons();
              return;
            }

            const table = targetElement.closest("table");
            const row = targetElement.closest("tr");
            const cell = targetElement.closest("td, th");

            if (
              !(table instanceof HTMLTableElement) ||
              !(row instanceof HTMLTableRowElement) ||
              !(cell instanceof HTMLTableCellElement)
            ) {
              if (isPointerNearActiveControl(event)) {
                return;
              }

              scheduleHideButtons();
              return;
            }

            if (!view.dom.contains(table)) {
              scheduleHideButtons();
              return;
            }

            const rows = Array.from(table.rows);
            const lastRow = rows.at(-1);
            if (lastRow && lastRow === row) {
              showRowButton(table, row);
            } else {
              hideRowButton();
            }

            const lastCell = row.cells[row.cells.length - 1];
            if (lastCell && lastCell === cell) {
              showColumnButton(table, cell);
            } else {
              hideColumnButton();
            }
          };

          const handleRowButtonClick = (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();

            if (!currentRowTable || !editor.isEditable) return;

            const lastRow =
              currentRowTable.rows[currentRowTable.rows.length - 1];
            const anchorCell = lastRow?.cells?.[0];
            if (!anchorCell) return;

            try {
              const cellPos = view.posAtDOM(anchorCell, 0);
              editor
                .chain()
                .focus()
                .setTextSelection(cellPos + 1)
                .addRowAfter()
                .run();
            } catch {
              editor.chain().focus().addRowAfter().run();
            }

            scheduleHideButtons();
          };

          const handleColumnButtonClick = (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();

            if (!currentColumnTable || !editor.isEditable) return;

            const firstRow = currentColumnTable.rows[0];
            const anchorCell = firstRow?.cells?.[firstRow.cells.length - 1];
            if (!anchorCell) return;

            try {
              const cellPos = view.posAtDOM(anchorCell, 0);
              editor
                .chain()
                .focus()
                .setTextSelection(cellPos + 1)
                .addColumnAfter()
                .run();
            } catch {
              editor.chain().focus().addColumnAfter().run();
            }

            hideButtons();
          };

          const handleMouseLeave = (event: MouseEvent) => {
            if (isControlButton(event.relatedTarget)) {
              return;
            }

            if (
              isHTMLElement(event.relatedTarget) &&
              view.dom.contains(event.relatedTarget)
            ) {
              return;
            }

            scheduleHideButtons();
          };

          const handleDocumentMouseMove = (event: MouseEvent) => {
            if (!isRowButtonVisible && !isColumnButtonVisible) return;

            if (isPointerNearActiveControl(event)) {
              cancelScheduledHide();
              return;
            }

            scheduleHideButtons();
          };

          const getActiveCellPos = () => {
            const cellPos = TABLE_SIDE_CONTROLS_PLUGIN_KEY.getState(view.state);
            return typeof cellPos === "number" ? cellPos : null;
          };

          const updateCellMenuPosition = () => {
            const cellPos = getActiveCellPos();

            if (cellPos === null) {
              hideCellMenu();
              return;
            }

            const cellDOM = view.nodeDOM(cellPos);

            if (!(cellDOM instanceof HTMLTableCellElement)) {
              hideCellMenu();
              return;
            }

            const cellRect = cellDOM.getBoundingClientRect();

            cellMenu.style.left = `${Math.round(cellRect.right - 6)}px`;
            cellMenu.style.top = `${Math.round(
              cellRect.top + cellRect.height / 2 + 12
            )}px`;
          };

          const showCellMenu = () => {
            if (!editor.isEditable || !editor.isFocused) return;

            if (!isCellMenuVisible) {
              isCellMenuVisible = true;
              cellMenu.style.display = "flex";
              renderCellMenu();
            }

            updateCellMenuPosition();
          };

          const applyCellAttribute = (
            name: "color" | "backgroundColor",
            value: string | null
          ) => {
            editor.chain().focus().setCellAttribute(name, value).run();
            showCellMenu();
            updateCellButton();
          };

          const clearCellContent = () => {
            const cellPos = getActiveCellPos();
            const cell =
              cellPos !== null ? view.state.doc.nodeAt(cellPos) : null;
            const paragraphType = view.state.schema.nodes.paragraph;
            const paragraph = paragraphType?.createAndFill();

            if (cellPos === null || !cell || !paragraph) {
              return;
            }

            const tr = view.state.tr.replaceWith(
              cellPos + 1,
              cellPos + cell.nodeSize - 1,
              paragraph
            );

            view.dispatch(tr);
            editor.chain().focus().run();
            hideCellMenu();
            updateCellButton();
          };

          const updateCellButton = () => {
            if (!editor.isEditable || !editor.isFocused) {
              hideCellButton();
              hideCellMenu();
              return;
            }

            const cellPos = TABLE_SIDE_CONTROLS_PLUGIN_KEY.getState(view.state);

            if (typeof cellPos !== "number") {
              hideCellButton();
              hideCellMenu();
              return;
            }

            const cellDOM = view.nodeDOM(cellPos);

            if (!(cellDOM instanceof HTMLTableCellElement)) {
              hideCellButton();
              hideCellMenu();
              return;
            }

            const cellRect = cellDOM.getBoundingClientRect();

            if (cellRect.width <= 0 || cellRect.height <= 0) {
              hideCellButton();
              hideCellMenu();
              return;
            }

            cellButton.style.display = "flex";
            cellButton.style.left = `${Math.round(
              cellRect.right - CELL_ACTION_BUTTON_WIDTH_PX / 2
            )}px`;
            cellButton.style.top = `${Math.round(
              cellRect.top + cellRect.height / 2
            )}px`;
            isCellButtonVisible = true;

            if (isCellMenuVisible) {
              updateCellMenuPosition();
            }
          };

          const updateMultiCellOverlay = () => {
            if (
              !editor.isEditable ||
              !editor.isFocused ||
              !(view.state.selection instanceof CellSelection)
            ) {
              hideMultiCellOverlay();
              return;
            }

            let left = Infinity;
            let top = Infinity;
            let right = -Infinity;
            let bottom = -Infinity;

            view.state.selection.forEachCell((_cell, cellPos) => {
              const cellDOM = view.nodeDOM(cellPos);

              if (!(cellDOM instanceof HTMLTableCellElement)) {
                return;
              }

              const cellRect = cellDOM.getBoundingClientRect();

              left = Math.min(left, cellRect.left);
              top = Math.min(top, cellRect.top);
              right = Math.max(right, cellRect.right);
              bottom = Math.max(bottom, cellRect.bottom);
            });

            if (
              !Number.isFinite(left) ||
              !Number.isFinite(top) ||
              !Number.isFinite(right) ||
              !Number.isFinite(bottom) ||
              right <= left ||
              bottom <= top
            ) {
              hideMultiCellOverlay();
              return;
            }

            hideCellButton();
            hideCellMenu();
            multiCellOverlay.style.display = "block";
            multiCellOverlay.style.left = `${Math.round(left)}px`;
            multiCellOverlay.style.top = `${Math.round(top)}px`;
            multiCellOverlay.style.width = `${Math.round(right - left)}px`;
            multiCellOverlay.style.height = `${Math.round(bottom - top)}px`;
          };

          const handleWindowScroll = () => {
            if (isRowButtonVisible && currentRowTable && currentRow) {
              showRowButton(currentRowTable, currentRow);
            }

            if (
              isColumnButtonVisible &&
              currentColumnTable &&
              currentColumnCell
            ) {
              showColumnButton(currentColumnTable, currentColumnCell);
            }

            if (isCellButtonVisible) {
              updateCellButton();
            }

            updateMultiCellOverlay();
          };

          const handleWindowResize = () => {
            if (isRowButtonVisible && currentRowTable && currentRow) {
              showRowButton(currentRowTable, currentRow);
            }

            if (
              isColumnButtonVisible &&
              currentColumnTable &&
              currentColumnCell
            ) {
              showColumnButton(currentColumnTable, currentColumnCell);
            }

            updateCellButton();
            updateMultiCellOverlay();
          };

          const handleDocumentMouseDown = (event: MouseEvent) => {
            if (!isCellMenuVisible || isControlButton(event.target)) {
              return;
            }

            hideCellMenu();
          };

          renderCellMenu = () => {
            if (!cellMenuRoot) {
              return;
            }

            cellMenuRoot.render(
              createElement(TableCellMenu, {
                open: isCellMenuVisible,
                onOpenChange: (open) => {
                  if (open === isCellMenuVisible) {
                    return;
                  }

                  if (open) {
                    showCellMenu();
                    return;
                  }

                  hideCellMenu();
                },
                onSetTextColor: (color) => {
                  applyCellAttribute("color", color);
                },
                onSetBackgroundColor: (color) => {
                  applyCellAttribute("backgroundColor", color);
                },
                onClearContents: clearCellContent,
              })
            );
          };

          cellMenuRoot = createRoot(cellMenu);
          renderCellMenu();

          doc.body.append(
            rowButton,
            columnButton,
            cellButton,
            multiCellOverlay,
            cellMenu
          );
          rowButton.style.display = "none";
          columnButton.style.display = "none";
          cellButton.style.display = "none";
          multiCellOverlay.style.display = "none";
          cellMenu.style.display = "none";

          view.dom.addEventListener("mousemove", updateButtonFromEvent);
          view.dom.addEventListener("mouseleave", handleMouseLeave);
          doc.addEventListener("mousemove", handleDocumentMouseMove);
          doc.addEventListener("mousedown", handleDocumentMouseDown);
          rowButton.addEventListener("mouseenter", () => {
            cancelScheduledHide();

            if (currentRowTable && currentRow) {
              showRowButton(currentRowTable, currentRow);
            }
          });
          columnButton.addEventListener("mouseenter", () => {
            cancelScheduledHide();

            if (currentColumnTable && currentColumnCell) {
              showColumnButton(currentColumnTable, currentColumnCell);
            }
          });
          rowButton.addEventListener("mouseleave", () => {
            scheduleHideButtons();
          });
          columnButton.addEventListener("mouseleave", () => {
            scheduleHideButtons();
          });
          rowButton.addEventListener("mousedown", (event) => {
            event.preventDefault();
          });
          columnButton.addEventListener("mousedown", (event) => {
            event.preventDefault();
          });
          cellButton.addEventListener("mousedown", (event) => {
            event.preventDefault();
            event.stopPropagation();
          });
          cellButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (isCellMenuVisible) {
              hideCellMenu();
            } else {
              showCellMenu();
            }
          });
          cellMenu.addEventListener("mousedown", (event) => {
            event.preventDefault();
            event.stopPropagation();
          });
          rowButton.addEventListener("click", handleRowButtonClick);
          columnButton.addEventListener("click", handleColumnButtonClick);
          window.addEventListener("scroll", handleWindowScroll, true);
          window.addEventListener("resize", handleWindowResize);

          return {
            update: () => {
              if (!editor.isEditable) {
                hideButtons();
                hideCellButton();
                hideMultiCellOverlay();
              } else {
                handleWindowResize();
              }
            },
            destroy: () => {
              cancelScheduledHide();
              view.dom.removeEventListener("mousemove", updateButtonFromEvent);
              view.dom.removeEventListener("mouseleave", handleMouseLeave);
              doc.removeEventListener("mousemove", handleDocumentMouseMove);
              doc.removeEventListener("mousedown", handleDocumentMouseDown);
              rowButton.removeEventListener("click", handleRowButtonClick);
              columnButton.removeEventListener(
                "click",
                handleColumnButtonClick
              );
              window.removeEventListener("scroll", handleWindowScroll, true);
              window.removeEventListener("resize", handleWindowResize);
              rowButton.remove();
              columnButton.remove();
              cellButton.remove();
              multiCellOverlay.remove();
              cellMenuRoot?.unmount();
              cellMenu.remove();
            },
          };
        },
      }),
    ];
  },
});
