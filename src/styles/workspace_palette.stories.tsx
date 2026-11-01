import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Toaster } from "@/components/sonner";

type Item = { label: string; background: string; foreground: string };
const groups = [
  {
    title: "Avisos genéricos",
    items: [
      ["error", "Error"],
      ["success", "Éxito"],
      ["warning", "Advertencia"],
      ["info", "Información"],
      ["loading", "Cargando"],
    ].map(
      ([key, label]): Item => ({
        label,
        background: `--status-background-${key}`,
        foreground: `--status-foreground-${key}`,
      }),
    ),
  },
];

function WorkspacePalette({ workspaceHue }: { workspaceHue: number }) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.getPropertyValue("--theme-hue");
    const priority = root.style.getPropertyPriority("--theme-hue");
    root.style.setProperty("--theme-hue", String(workspaceHue));
    return () => {
      if (previous) root.style.setProperty("--theme-hue", previous, priority);
      else root.style.removeProperty("--theme-hue");
    };
  }, [workspaceHue]);

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <header className="space-y-2">
        <h1 className="text-xl font-medium">Marca y estados genéricos</h1>
        <p className="text-sm text-muted-foreground">
          Cambia el matiz en Controls y el tema en la barra superior para
          comparar el acento y los avisos compartidos.
        </p>
      </header>
      {groups.map(({ title, items }) => (
        <section key={title} className="space-y-3">
          <h2 className="text-sm font-medium">{title}</h2>
          <div className="flex flex-wrap gap-2">
            {items.map(({ label, background, foreground }) => (
              <Badge
                key={label}
                variant="outline"
                data-palette-background={background}
                data-palette-foreground={foreground}
                className="rounded-md border-transparent px-3 py-1"
                style={{
                  backgroundColor: `var(${background})`,
                  color: `var(${foreground})`,
                }}
              >
                {label}
              </Badge>
            ))}
          </div>
        </section>
      ))}
      <Button
        className="self-start"
        variant="outline"
        onClick={() => {
          toast.success("Cambios guardados");
          toast.error("No se pudo guardar");
          toast.warning("Revisa los datos");
          toast.info("Hay una actualización disponible");
        }}
      >
        Probar avisos
      </Button>
      <Toaster expand position="bottom-right" visibleToasts={4} />
    </main>
  );
}

const meta = {
  title: "Foundations/WorkspacePalette",
  component: WorkspacePalette,
  parameters: { layout: "fullscreen" },
  argTypes: {
    workspaceHue: { control: { type: "range", min: 0, max: 360, step: 1 } },
  },
} satisfies Meta<typeof WorkspacePalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: { workspaceHue: 254 },
  globals: { theme: "light" },
};

export const Dark: Story = {
  args: { workspaceHue: 254 },
  globals: { theme: "dark" },
};

export const GreenWorkspace: Story = {
  args: { workspaceHue: 162 },
};

export const RoseWorkspace: Story = {
  args: { workspaceHue: 17 },
};
