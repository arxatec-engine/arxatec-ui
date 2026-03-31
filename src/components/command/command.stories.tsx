import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import { classNameControl } from "@/utilities/storybook";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./index";

type CommandStoryArgs = ComponentProps<typeof Command> & {
  placeholder?: string;
  vacio?: string;
  grupo1titulo?: string;
  grupo2titulo?: string;
  item1?: string;
  item2?: string;
  item3?: string;
  atajo?: string;
};

const meta = {
  title: "Components/Command",
  component: Command,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    ...classNameControl,
    placeholder: { control: "text" },
    vacio: { control: "text", name: "Texto sin resultados" },
    grupo1titulo: { control: "text", name: "Título grupo 1" },
    grupo2titulo: { control: "text", name: "Título grupo 2" },
    item1: { control: "text" },
    item2: { control: "text" },
    item3: { control: "text" },
    atajo: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<CommandStoryArgs>;

export default meta;

type Story = StoryObj<CommandStoryArgs>;

export const Paleta: Story = {
  args: {
    placeholder: "Buscar comando…",
    vacio: "Sin resultados.",
    grupo1titulo: "Sugerencias",
    grupo2titulo: "Más",
    item1: "Calendario",
    item2: "Buscar",
    item3: "Configuración",
    atajo: "⌘C",
  },
  render: ({
    placeholder,
    vacio,
    grupo1titulo,
    grupo2titulo,
    item1,
    item2,
    item3,
    atajo,
    ...root
  }) => (
    <Command className="rounded-lg border shadow-md" {...root}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{vacio}</CommandEmpty>
        <CommandGroup heading={grupo1titulo}>
          <CommandItem>
            {item1}
            <CommandShortcut>{atajo}</CommandShortcut>
          </CommandItem>
          <CommandItem>{item2}</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={grupo2titulo}>
          <CommandItem>{item3}</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
