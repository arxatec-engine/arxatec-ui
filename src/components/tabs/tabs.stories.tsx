import type { Meta, StoryObj } from "@storybook/react-vite";

import { classNameControl } from "@/utilities/storybook";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./index";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    ...classNameControl,
    defaultValue: {
      control: "text",
      description: "Pestaña activa al inicio",
    },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: "uno",
    orientation: "horizontal",
  },
  render: (args) => (
    <Tabs {...args}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="uno">Uno</TabsTrigger>
        <TabsTrigger value="dos">Dos</TabsTrigger>
      </TabsList>
      <TabsContent value="uno" className="rounded-md border p-3 text-sm">
        Contenido de la primera pestaña.
      </TabsContent>
      <TabsContent value="dos" className="rounded-md border p-3 text-sm">
        Contenido de la segunda pestaña.
      </TabsContent>
    </Tabs>
  ),
};
