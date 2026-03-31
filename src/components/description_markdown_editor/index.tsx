import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown_menu";
import { Button } from "@/components/button";
import { Separator } from "@/components/separator";
import { cn } from "@/utilities";
import type { Editor } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Italic,
  List,
  ListOrdered,
  TextQuote,
  Type,
  Underline as UnderlineIcon,
} from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from "react";
import TurndownService from "turndown";
import styles from "./index.module.css";
import { htmlForMarkdownExport, parseMarkdownToHtml } from "./utils";
import { ToolbarButton } from "./components";

const createExtensions = (placeholder: string) => [
  StarterKit.configure({
    heading: { levels: [1, 2, 3, 4] },
    codeBlock: false,
    horizontalRule: false,
  }),
  Underline,
  Placeholder.configure({
    placeholder,
    emptyNodeClass: "is-description-editor-empty",
  }),
];

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});
turndown.addRule("underline", {
  filter: ["u"],
  replacement: (content) => `<u>${content}</u>`,
});
turndown.addRule("lineBreak", {
  filter: "br",
  replacement: () => "  \n",
});

export interface DescriptionMarkdownEditorRef {
  insertContent: (text: string) => void;
  clearContent: () => void;
}

interface DescriptionMarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onEscape?: () => void;
  className?: string;
  editorClassName?: string;
  disabled?: boolean;
  footer?: React.ReactNode;
}

export const DescriptionMarkdownEditor = forwardRef<
  DescriptionMarkdownEditorRef,
  DescriptionMarkdownEditorProps
>(function DescriptionMarkdownEditor(
  {
    value,
    onChange,
    placeholder = "Escribe una descripción...",
    onSubmit,
    onEscape,
    className,
    editorClassName,
    disabled = false,
    footer,
  },
  ref
) {
  const editorRef = useRef<Editor | null>(null);
  const lastEmittedMarkdownRef = useRef<string>(value);
  const [, bumpToolbar] = useReducer((n: number) => n + 1, 0);
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  const insertNewline = useCallback(() => {
    const ed = editorRef.current;
    if (!ed) return true;
    const inList = ed.isActive("bulletList") || ed.isActive("orderedList");
    if (inList) {
      const { $from } = ed.state.selection;
      const isEmptyListItem = $from.parent.textContent === "";
      if (isEmptyListItem) {
        ed.chain().focus().liftListItem("listItem").run();
      } else {
        ed.chain().focus().splitListItem("listItem").run();
      }
    } else {
      ed.chain().focus().splitBlock().run();
    }
    return true;
  }, []);

  const editor = useEditor({
    extensions: createExtensions(placeholder),
    content: value ? parseMarkdownToHtml(value) : "",
    editable: !disabled,
    onSelectionUpdate: bumpToolbar,
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
      handleKeyDown: (_, event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onEscape?.();
          return true;
        }
        if (event.key !== "Enter") return false;

        if (event.shiftKey || !onSubmitRef.current) {
          event.preventDefault();
          return insertNewline();
        }

        event.preventDefault();
        onSubmitRef.current();
        return true;
      },
    },
  });

  const syncToMarkdown = useCallback(() => {
    if (!editor) return;
    const html = editor.getHTML();
    if (html === "<p></p>" || html === "<p><br></p>") {
      lastEmittedMarkdownRef.current = "";
      onChange("");
    } else {
      const md = turndown.turndown(htmlForMarkdownExport(html));
      lastEmittedMarkdownRef.current = md;
      onChange(md);
    }
  }, [editor, onChange]);

  useEffect(() => {
    if (!editor) return;
    editor.on("update", syncToMarkdown);
    return () => {
      editor.off("update", syncToMarkdown);
    };
  }, [editor, syncToMarkdown]);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor) return;
    if (value === lastEmittedMarkdownRef.current) return;
    lastEmittedMarkdownRef.current = value;
    const parsedFromValue = value ? parseMarkdownToHtml(value) : "";
    editor.commands.setContent(parsedFromValue, { emitUpdate: false });
  }, [value, editor]);

  const handleBold = (e: Editor) => e.chain().focus().toggleBold().run();
  const handleItalic = (e: Editor) => e.chain().focus().toggleItalic().run();
  const handleUnderline = (e: Editor) =>
    e.chain().focus().toggleUnderline().run();
  const handleOrderedList = (e: Editor) =>
    e.chain().focus().toggleOrderedList().run();
  const handleBulletList = (e: Editor) =>
    e.chain().focus().toggleBulletList().run();
  const handleBlockquote = (e: Editor) =>
    e.chain().focus().toggleBlockquote().run();
  const handleCode = (e: Editor) => e.chain().focus().toggleCode().run();

  const headingMenuValue = (() => {
    if (!editor) return "paragraph";
    if (editor.isActive("heading", { level: 1 })) return "1";
    if (editor.isActive("heading", { level: 2 })) return "2";
    if (editor.isActive("heading", { level: 3 })) return "3";
    if (editor.isActive("heading", { level: 4 })) return "4";
    return "paragraph";
  })();

  const applyHeadingStyle = (value: string) => {
    if (!editor) return;
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
      return;
    }
    const level = Number(value) as 1 | 2 | 3 | 4;
    editor.chain().focus().setHeading({ level }).run();
  };

  const HeadingTriggerIcon =
    headingMenuValue === "1"
      ? Heading1
      : headingMenuValue === "2"
      ? Heading2
      : headingMenuValue === "3"
      ? Heading3
      : headingMenuValue === "4"
      ? Heading4
      : Type;

  useImperativeHandle(
    ref,
    () => ({
      insertContent: (text: string) => {
        editor?.chain().focus().insertContent(text).run();
      },
      clearContent: () => {
        editor?.commands.clearContent(true);
      },
    }),
    [editor]
  );

  if (!editor) return null;

  return (
    <div
      className={cn(
        "flex flex-col shrink-0 border border-border rounded-md bg-card",
        className
      )}
    >
      <div className={cn(styles.wrapper, editorClassName)}>
        <EditorContent editor={editor} />
      </div>

      <div className="flex items-center justify-start pb-2 px-2 pt-2 gap-2 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={disabled}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 gap-1 px-2 shrink-0 font-normal",
                headingMenuValue !== "paragraph" && "bg-accent"
              )}
              disabled={disabled}
            >
              <HeadingTriggerIcon className="size-4" aria-hidden />
              <ChevronDown className="size-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="min-w-44"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal uppercase tracking-wide">
              Encabezados
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={headingMenuValue}
              onValueChange={applyHeadingStyle}
            >
              <DropdownMenuRadioItem value="paragraph" className="text-sm">
                Párrafo
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="1"
                className="text-sm font-semibold"
              >
                Título 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="2"
                className="text-sm font-semibold"
              >
                Título 2
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="3" className="text-sm font-medium">
                Título 3
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="4" className="text-sm font-medium">
                Título 4
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator
          orientation="vertical"
          className="h-[24px]! shrink-0 w-[2px]"
        />

        <ToolbarButton
          editor={editor}
          onClick={handleBold}
          isActive={(e) => e.isActive("bold")}
          canDo={(e) => e.can().toggleBold()}
          icon={Bold}
          label="Negrita"
        />
        <ToolbarButton
          editor={editor}
          onClick={handleItalic}
          isActive={(e) => e.isActive("italic")}
          canDo={(e) => e.can().toggleItalic()}
          icon={Italic}
          label="Cursiva"
        />
        <ToolbarButton
          editor={editor}
          onClick={handleUnderline}
          isActive={(e) => e.isActive("underline")}
          canDo={(e) => e.can().toggleUnderline()}
          icon={UnderlineIcon}
          label="Subrayado"
        />

        <Separator
          orientation="vertical"
          className="h-[24px]! shrink-0 w-[2px]"
        />

        <ToolbarButton
          editor={editor}
          onClick={handleOrderedList}
          isActive={(e) => e.isActive("orderedList")}
          canDo={() => true}
          icon={ListOrdered}
          label="Lista numerada"
        />
        <ToolbarButton
          editor={editor}
          onClick={handleBulletList}
          isActive={(e) => e.isActive("bulletList")}
          canDo={() => true}
          icon={List}
          label="Lista de viñetas"
        />

        <Separator
          orientation="vertical"
          className="h-[24px]! shrink-0 w-[2px]"
        />

        <ToolbarButton
          editor={editor}
          onClick={handleBlockquote}
          isActive={(e) => e.isActive("blockquote")}
          canDo={(e) => e.can().toggleBlockquote()}
          icon={TextQuote}
          label="Cita"
        />
        <ToolbarButton
          editor={editor}
          onClick={handleCode}
          isActive={(e) => e.isActive("code")}
          canDo={(e) => e.can().toggleCode()}
          icon={Code}
          label="Código"
        />
      </div>

      {footer && (
        <div className="flex items-center justify-end pb-2 px-2 gap-2">
          {footer}
        </div>
      )}
    </div>
  );
});
