import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { MentionList } from ".";
import type { MentionItem } from "./types";

const SAMPLE_ITEMS: MentionItem[] = [
  { id: "1", label: "Ana García", subtitle: "Socia Principal" },
  { id: "2", label: "Carlos López", subtitle: "Abogado Senior" },
  { id: "3", label: "María Rodríguez", subtitle: "Paralegal" },
  { id: "4", label: "Juan Martínez", subtitle: "Investigador Legal" },
  { id: "5", label: "Laura Hernández", subtitle: "Asistente Jurídica" },
  { id: "6", label: "Roberto Silva", subtitle: "Abogado Senior" },
  { id: "7", label: "Carmen Torres", subtitle: "Socia Principal" },
];

const SAMPLE_ITEMS_CON_IMAGEN: MentionItem[] = [
  {
    id: "1",
    label: "Ana García",
    image: "https://i.pravatar.cc/150?u=ana",
  },
  {
    id: "2",
    label: "Carlos López",
    image: "https://i.pravatar.cc/150?u=carlos",
  },
  {
    id: "3",
    label: "María Rodríguez",
    image: "https://i.pravatar.cc/150?u=maria",
  },
  {
    id: "4",
    label: "Juan Martínez",
    image: "https://i.pravatar.cc/150?u=juan",
  },
  {
    id: "5",
    label: "Laura Hernández",
    image: "https://i.pravatar.cc/150?u=laura",
  },
];

type MentionListStoryArgs = {
  mostrarSubtitulo?: boolean;
  mostrarImagenes?: boolean;
};

const meta = {
  title: "Components/MentionList",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    mostrarSubtitulo: {
      control: "boolean",
      name: "Mostrar subtítulo",
    },
    mostrarImagenes: {
      control: "boolean",
      name: "Mostrar imágenes",
    },
  },
} satisfies Meta<MentionListStoryArgs>;

export default meta;

type Story = StoryObj<MentionListStoryArgs>;

function InteractiveMentionList({ items }: { items: MentionItem[] }) {
  const [query, setQuery] = useState("");
  const [lastSelected, setLastSelected] = useState<string | null>(null);

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center gap-4 w-72">
      <div className="w-full">
        <label className="text-xs text-muted-foreground mb-1.5 block">
          Simula escritura en el editor
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Escribe para filtrar..."
          className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <MentionList
        items={filtered}
        query={query}
        command={({ label }) => setLastSelected(label)}
      />

      {lastSelected && (
        <p className="text-xs text-muted-foreground">
          Seleccionado:{" "}
          <span className="font-medium text-foreground">@{lastSelected}</span>
        </p>
      )}
    </div>
  );
}

export const Interactivo: Story = {
  args: {
    mostrarSubtitulo: true,
    mostrarImagenes: false,
  },
  render: ({ mostrarSubtitulo, mostrarImagenes }) => {
    const items = (
      mostrarImagenes ? SAMPLE_ITEMS_CON_IMAGEN : SAMPLE_ITEMS
    ).map((item) => ({
      ...item,
      subtitle: mostrarSubtitulo ? item.subtitle : undefined,
    }));
    return <InteractiveMentionList items={items} />;
  },
};

export const ConImagenes: Story = {
  args: {
    mostrarSubtitulo: true,
  },
  argTypes: {
    mostrarImagenes: { table: { disable: true } },
  },
  render: ({ mostrarSubtitulo }) => {
    const items = SAMPLE_ITEMS_CON_IMAGEN.map((item) => ({
      ...item,
      subtitle: mostrarSubtitulo ? item.subtitle : undefined,
    }));
    return <InteractiveMentionList items={items} />;
  },
};

export const SinResultados: Story = {
  args: {},
  argTypes: {
    mostrarSubtitulo: { table: { disable: true } },
    mostrarImagenes: { table: { disable: true } },
  },
  render: () => <MentionList items={[]} query="xyz" command={() => {}} />,
};

export const SinSubtitulo: Story = {
  args: {},
  argTypes: {
    mostrarSubtitulo: { table: { disable: true } },
    mostrarImagenes: { table: { disable: true } },
  },
  render: () => {
    const items = SAMPLE_ITEMS.map(({ id, label }) => ({ id, label }));
    return <InteractiveMentionList items={items} />;
  },
};
