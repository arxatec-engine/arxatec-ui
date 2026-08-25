import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  BookTextIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  CircleHelpIcon,
  FoldersIcon,
  HammerIcon,
  LayersIcon,
  MessageSquareIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  UsersIcon,
  useAnimatedIcon,
} from "./index";

type AnimatedIconsStoryArgs = {
  gap?: string;
  classNameFila?: string;
};

const meta = {
  title: "Components/AnimatedIcons",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    gap: {
      control: "text",
      description: "Clase gap del contenedor (ej. gap-6)",
    },
    classNameFila: {
      control: "text",
      description: "Clases del contenedor flex",
    },
  },
} satisfies Meta<AnimatedIconsStoryArgs>;

export default meta;

type Story = StoryObj<AnimatedIconsStoryArgs>;

export const Galeria: Story = {
  args: {
    gap: "gap-6",
    classNameFila:
      "flex max-w-lg flex-wrap items-center justify-center text-foreground",
  },
  render: ({ gap, classNameFila }) => (
    <div className={`${classNameFila} ${gap}`}>
      <UsersIcon />
      <SearchIcon />
      <LayersIcon />
      <FoldersIcon />
      <SlidersHorizontalIcon />
      <ChartPieIcon />
      <CalendarDaysIcon />
      <CircleHelpIcon />
      <PanelLeftCloseIcon />
      <PanelLeftOpenIcon />
      <SparklesIcon />
      <BookTextIcon />
      <MessageSquareIcon />
      <HammerIcon />
    </div>
  ),
};

function ControlledDemo() {
  const { iconRef, onMouseEnter, onMouseLeave } = useAnimatedIcon();

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm text-foreground"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <SearchIcon ref={iconRef} size={20} />
      Buscar
    </button>
  );
}

/**
 * Con `ref` el icono deja de animarse por su cuenta: quien dispara la animación
 * es el contenedor, que es el caso real de un icono dentro de un botón.
 */
export const Controlado: Story = {
  render: () => <ControlledDemo />,
};
