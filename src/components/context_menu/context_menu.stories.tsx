import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from './index'

const meta = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    textoZona: { control: 'text', name: 'Texto del área' },
    item1: { control: 'text' },
    item2: { control: 'text' },
    item3: { control: 'text' },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    textoZona: 'Clic derecho aquí',
    item1: 'Copiar',
    item2: 'Pegar',
    item3: 'Eliminar',
  },
  render: ({ textoZona, item1, item2, item3, ...root }) => (
    <ContextMenu {...root}>
      <ContextMenuTrigger className="text-muted-foreground flex h-32 w-64 items-center justify-center rounded-md border border-dashed text-sm">
        {textoZona}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem>{item1}</ContextMenuItem>
        <ContextMenuItem>{item2}</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">{item3}</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
}
