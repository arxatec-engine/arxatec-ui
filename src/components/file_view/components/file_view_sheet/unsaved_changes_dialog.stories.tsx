import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { FileViewUnsavedChangesDialog } from "./unsaved_changes_dialog";

const meta = {
  title: "FileView/UnsavedChangesDialog",
  component: FileViewUnsavedChangesDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Diálogo de confirmación al salir con cambios sin guardar en la pestaña Editar.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    open: false,
    onOpenChange: () => {},
    onConfirmDiscard: () => {},
  },
  argTypes: {
    onConfirmDiscard: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
  },
} satisfies Meta<typeof FileViewUnsavedChangesDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

function StatefulDialog(
  props: Omit<
    React.ComponentProps<typeof FileViewUnsavedChangesDialog>,
    "open" | "onOpenChange"
  >,
) {
  const [open, setOpen] = useState(true);
  return (
    <FileViewUnsavedChangesDialog
      {...props}
      open={open}
      onOpenChange={setOpen}
    />
  );
}

export const Default: Story = {
  render: (args) => (
    <StatefulDialog {...args} onConfirmDiscard={() => {}} />
  ),
};
