import { ReactRenderer } from "@tiptap/react";
import {
  computePosition,
  flip,
  shift,
  offset,
  autoUpdate,
  type ComputePositionConfig
} from "@floating-ui/dom";
import type { SuggestionProps } from "@tiptap/suggestion";
import { MentionList } from "../index.tsx";
import type { MentionItem, MentionListRef } from "../types";

export const createMentionSuggestion = (getItems: (query: string) => MentionItem[] | Promise<MentionItem[]>) => {
  return {
    items: ({ query }: { query: string }) => {
      return getItems(query);
    },

    render: () => {
      let component: ReactRenderer<MentionListRef>;
      let popupElement: HTMLDivElement | null = null;
      let cleanup: (() => void) | null = null;

      return {
        onStart: (props: SuggestionProps) => {
          component = new ReactRenderer(MentionList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popupElement = document.createElement('div');
          popupElement.style.width = 'max-content';
          popupElement.style.position = 'absolute';
          popupElement.style.top = '0';
          popupElement.style.left = '0';
          popupElement.style.zIndex = '999';
          popupElement.appendChild(component.element);
          document.body.appendChild(popupElement);

          const virtualElement = {
            getBoundingClientRect: props.clientRect as () => DOMRect,
          } as Element;

          const updatePosition = () => {
            if (!props.clientRect || !popupElement) return;

            const config: ComputePositionConfig = {
              placement: 'top-start',
              middleware: [
                offset(10),
                flip(),
                shift({ padding: 10 }),
              ],
            };

            computePosition(virtualElement, popupElement, config).then(({ x, y }) => {
              if (popupElement) {
                Object.assign(popupElement.style, {
                  left: `${x}px`,
                  top: `${y}px`,
                });
              }
            });
          };

          cleanup = autoUpdate(virtualElement, popupElement, updatePosition);
        },

        onUpdate(props: SuggestionProps) {
          component.updateProps(props);

          if (!props.clientRect || !popupElement) {
            return;
          }

          const virtualElement = {
            getBoundingClientRect: props.clientRect as () => DOMRect,
          } as Element;

          computePosition(virtualElement, popupElement, {
            placement: 'top-start',
            middleware: [
              offset(10),
              flip(),
              shift({ padding: 10 }),
            ],
          }).then(({ x, y }) => {
            if (popupElement) {
              Object.assign(popupElement.style, {
                left: `${x}px`,
                top: `${y}px`,
              });
            }
          });
        },

        onKeyDown(props: { event: KeyboardEvent }) {
          if (props.event.key === "Escape") {
            if (popupElement) popupElement.style.display = 'none';
            return true;
          }

          return component.ref?.onKeyDown(props) ?? false;
        },

        onExit() {
          if (cleanup) cleanup();
          if (popupElement && popupElement.parentNode) {
            popupElement.parentNode.removeChild(popupElement);
          }
          component.destroy();
          popupElement = null;
        },
      };
    },
  };
};
