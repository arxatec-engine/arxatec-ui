import {
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  List,
  Code2,
  ChevronRight,
  Quote,
  ImageIcon,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CodeSquare,
  SearchXIcon,
} from "lucide-react";
import { FloatingElement } from "../../ui/floating-element";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/command";
import { ScrollArea } from "@/components/scroll_area";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/utilities";
import type { Editor } from "@tiptap/core";
import { useDebounce } from "@/hooks";

interface CommandItemType {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string;
  command: (editor: Editor) => void;
  group: string;
}

type CommandGroupType = {
  group: string;
  items: Omit<CommandItemType, "group">[];
};

const groups: CommandGroupType[] = [
  /* {
    group: "INTELIGENCIA ARTIFICIAL",
    items: [
      {
        title: "Escribir con IA",
        description: "Usa la IA para redactar, editar o mejorar texto",
        icon: Sparkles,
        keywords: "ai ia magic artificial inteligencia escribir write",
        command: (editor) => {
          editor.commands.focus();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (editor as any).options.onOpenAiModal?.();
        },
      },
    ],
  }, */
  {
    group: "BLOQUES BÁSICOS",
    items: [
      {
        title: "Texto",
        description: "Comienza a escribir texto plano",
        icon: ChevronRight,
        keywords: "parrafo texto paragraph text",
        command: (editor) => editor.chain().focus().clearNodes().run(),
      },
      {
        title: "Título 1",
        description: "Título de sección grande",
        icon: Heading1,
        keywords: "h1 titulo cabecera title header",
        command: (editor) =>
          editor.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        title: "Título 2",
        description: "Título de sección mediano",
        icon: Heading2,
        keywords: "h2 subtitulo subtitle",
        command: (editor) =>
          editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        title: "Título 3",
        description: "Título de sección pequeño",
        icon: Heading3,
        keywords: "h3 subcabecera subheader",
        command: (editor) =>
          editor.chain().focus().toggleHeading({ level: 3 }).run(),
      },
      {
        title: "Lista de viñetas",
        description: "Crea una lista con viñetas simple",
        icon: List,
        keywords: "lista viñetas puntos unordered ul bullets",
        command: (editor) => editor.chain().focus().toggleBulletList().run(),
      },
      {
        title: "Lista numerada",
        description: "Crea una lista ordenada",
        icon: ListOrdered,
        keywords: "lista numero ordenada numbered ol",
        command: (editor) => editor.chain().focus().toggleOrderedList().run(),
      },
      {
        title: "Bloque de código",
        description: "Captura fragmentos de código",
        icon: Code2,
        keywords: "codigo fragmento snippet pre",
        command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
      },
      {
        title: "Imagen",
        description: "Inserta una imagen",
        icon: ImageIcon,
        keywords: "imagen foto fotografia image picture photo",
        command: (editor) =>
          editor.chain().focus().insertImagePlaceholder().run(),
      },
      {
        title: "Línea horizontal",
        description: "Añade un divisor horizontal",
        icon: Minus,
        keywords: "linea horizontal divisor rule divider",
        command: (editor) => editor.chain().focus().setHorizontalRule().run(),
      },
    ],
  },
  {
    group: "INTEGRADOS",
    items: [
      {
        title: "Cita",
        description: "Captura una cita",
        icon: Quote,
        keywords: "cita blockquote cite",
        command: (editor) => editor.chain().focus().toggleBlockquote().run(),
      },
      {
        title: "Código inline",
        description: "Fragmento de código en línea",
        icon: CodeSquare,
        keywords: "codigo inline",
        command: (editor) => editor.chain().focus().toggleCode().run(),
      },
    ],
  },
  {
    group: "ALINEACIÓN",
    items: [
      {
        title: "Alinear a la izquierda",
        description: "Alinea el texto a la izquierda",
        icon: AlignLeft,
        keywords: "alinear izquierda left",
        command: (editor) => editor.chain().focus().setTextAlign("left").run(),
      },
      {
        title: "Centrar",
        description: "Centra el texto",
        icon: AlignCenter,
        keywords: "centrar alinear center",
        command: (editor) =>
          editor.chain().focus().setTextAlign("center").run(),
      },
      {
        title: "Alinear a la derecha",
        description: "Alinea el texto a la derecha",
        icon: AlignRight,
        keywords: "alinear derecha right",
        command: (editor) => editor.chain().focus().setTextAlign("right").run(),
      },
    ],
  },
];

export function TipTapFloatingMenu({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const commandRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const selectedIndexRef = useRef(-1);
  const [isChildFocused, setIsChildFocused] = useState(false);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastSlashQueryRef = useRef<string | null>(null);

  const filteredGroups = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) =>
              item.title
                .toLowerCase()
                .includes(debouncedSearch.toLowerCase()) ||
              item.description
                .toLowerCase()
                .includes(debouncedSearch.toLowerCase()) ||
              item.keywords
                .toLowerCase()
                .includes(debouncedSearch.toLowerCase())
          ),
        }))
        .filter((group) => group.items.length > 0),
    [debouncedSearch]
  );

  const flatFilteredItems = useMemo(
    () => filteredGroups.flatMap((g) => g.items),
    [filteredGroups]
  );

  const highlightIndex = useMemo(() => {
    const len = flatFilteredItems.length;
    if (len === 0 || selectedIndex < 0) return -1;
    return Math.min(selectedIndex, len - 1);
  }, [flatFilteredItems.length, selectedIndex]);

  const executeCommand = useCallback(
    (commandFn: (editor: Editor) => void) => {
      if (!editor) return;

      try {
        const { from } = editor.state.selection;
        const slashCommandLength = search.length + 1;

        editor
          .chain()
          .focus()
          .deleteRange({
            from: Math.max(0, from - slashCommandLength),
            to: from,
          })
          .run();

        commandFn(editor);
      } catch (error) {
        console.error("Error executing command:", error);
      } finally {
        setIsOpen(false);
        setSearch("");
        setSelectedIndex(-1);
        selectedIndexRef.current = -1;
      }
    },
    [editor, search]
  );

  useEffect(() => {
    if (highlightIndex >= 0 && itemRefs.current[highlightIndex]) {
      itemRefs.current[highlightIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex]);

  const focusContextAllowsSlashKeys = useCallback(() => {
    if (!editor?.options.element) return false;
    const editorEl = editor.options.element as HTMLElement;
    const active = document.activeElement;
    return (active != null && editorEl.contains(active)) || isChildFocused;
  }, [editor, isChildFocused]);

  useEffect(() => {
    if (!isOpen || !editor) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (!focusContextAllowsSlashKeys()) return;

      const len = flatFilteredItems.length;
      const stop = () => {
        e.preventDefault();
        e.stopPropagation();
      };

      switch (e.key) {
        case "ArrowDown": {
          if (len === 0) return;
          stop();
          setSelectedIndex((prev) => {
            const cur = prev === -1 ? -1 : Math.min(prev, len - 1);
            const next = cur === -1 ? 0 : cur < len - 1 ? cur + 1 : 0;
            selectedIndexRef.current = next;
            return next;
          });
          break;
        }
        case "ArrowUp": {
          if (len === 0) return;
          stop();
          setSelectedIndex((prev) => {
            const cur = prev === -1 ? -1 : Math.min(prev, len - 1);
            const next = cur === -1 ? len - 1 : cur > 0 ? cur - 1 : len - 1;
            selectedIndexRef.current = next;
            return next;
          });
          break;
        }
        case "Tab": {
          if (len === 0) return;
          stop();
          if (e.shiftKey) {
            setSelectedIndex((prev) => {
              const cur = prev === -1 ? -1 : Math.min(prev, len - 1);
              const next = cur === -1 ? len - 1 : cur > 0 ? cur - 1 : len - 1;
              selectedIndexRef.current = next;
              return next;
            });
          } else {
            setSelectedIndex((prev) => {
              const cur = prev === -1 ? -1 : Math.min(prev, len - 1);
              const next = cur === -1 ? 0 : cur < len - 1 ? cur + 1 : 0;
              selectedIndexRef.current = next;
              return next;
            });
          }
          break;
        }
        case "Enter": {
          if (len === 0) return;
          stop();
          const idx =
            selectedIndexRef.current === -1
              ? 0
              : Math.min(selectedIndexRef.current, len - 1);
          const item = flatFilteredItems[idx];
          if (item) executeCommand(item.command);
          break;
        }
        case "Escape": {
          stop();
          setIsOpen(false);
          setSearch("");
          setSelectedIndex(-1);
          selectedIndexRef.current = -1;
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [
    isOpen,
    editor,
    flatFilteredItems,
    executeCommand,
    focusContextAllowsSlashKeys,
  ]);

  // Slash command detection logic
  useEffect(() => {
    if (!editor) return;

    const updateMenu = () => {
      const { state } = editor;
      const { $from } = state.selection;

      const currentLineText = $from.parent.textBetween(
        0,
        $from.parentOffset,
        "\n",
        " "
      );

      const isSlashCommand =
        (editor.isFocused || isChildFocused) &&
        currentLineText.startsWith("/") &&
        $from.parent.type.name !== "codeBlock" &&
        $from.parentOffset === currentLineText.length;

      if (isSlashCommand) {
        const query = currentLineText.slice(1).trim();
        if (lastSlashQueryRef.current !== query) {
          lastSlashQueryRef.current = query;
          setSelectedIndex(-1);
          selectedIndexRef.current = -1;
        }
        setSearch(query);
        setIsOpen(true);
      } else {
        lastSlashQueryRef.current = null;
        setIsOpen(false);
      }
    };

    editor.on("selectionUpdate", updateMenu);
    editor.on("update", updateMenu);
    editor.on("focus", updateMenu);
    const handleBlur = () => {
      setTimeout(() => {
        const isPopOverOpen = document.querySelector(
          '[data-radix-popper-content-wrapper], [role="dialog"]'
        );
        const shouldStillShow =
          editor.isFocused || isChildFocused || !!isPopOverOpen;
        // If we are not focused and no popover, then we follow the standard updateMenu logic
        if (!shouldStillShow) {
          setIsOpen(false);
        } else {
          updateMenu();
        }
      }, 200);
    };
    editor.on("blur", handleBlur);

    return () => {
      editor.off("selectionUpdate", updateMenu);
      editor.off("update", updateMenu);
      editor.off("focus", updateMenu);
      editor.off("blur", handleBlur);
    };
  }, [editor, isChildFocused]);

  return (
    <FloatingElement
      editor={editor}
      shouldShow={isOpen}
      floatingOptions={{
        placement: "bottom-start",
      }}
    >
      <Command
        role="listbox"
        ref={commandRef}
        className="z-50 w-72 overflow-hidden rounded-lg border bg-popover shadow-lg"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onFocus={() => setIsChildFocused(true)}
        onBlur={() => setIsChildFocused(false)}
      >
        <ScrollArea className="max-h-82.5">
          <CommandList>
            <CommandEmpty className="py-3 text-center text-sm text-muted-foreground h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <SearchXIcon className="size-7" />
                <p className="text-sm text-center">
                  No se encontraron
                  <br /> resultados.
                </p>
              </div>
            </CommandEmpty>

            {filteredGroups.map((group, groupIndex) => (
              <CommandGroup
                key={`${group.group}-${groupIndex}`}
                heading={
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {group.group}
                  </div>
                }
              >
                {group.items.map((item, itemIndex) => {
                  const flatIndex =
                    filteredGroups
                      .slice(0, groupIndex)
                      .reduce((acc, g) => acc + g.items.length, 0) + itemIndex;

                  return (
                    <CommandItem
                      role="option"
                      key={`${group.group}-${item.title}-${itemIndex}`}
                      value={`${group.group}-${item.title}`}
                      onSelect={() => executeCommand(item.command)}
                      className={cn(
                        "gap-3 aria-selected:bg-accent/50",
                        flatIndex === highlightIndex ? "bg-accent/50" : ""
                      )}
                      aria-selected={flatIndex === highlightIndex}
                      ref={(el) => {
                        itemRefs.current[flatIndex] = el;
                      }}
                      tabIndex={-1}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                      <kbd className="ml-auto flex h-5 items-center rounded bg-muted px-1.5 text-xs text-muted-foreground">
                        ↵
                      </kbd>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </ScrollArea>
      </Command>
    </FloatingElement>
  );
}
