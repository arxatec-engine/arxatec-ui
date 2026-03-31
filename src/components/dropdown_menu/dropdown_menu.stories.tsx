import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './index'

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    textoDisparador: { control: 'text', name: 'Texto del botón' },
    etiqueta: { control: 'text', name: 'Encabezado' },
    item1: { control: 'text', name: 'Ítem 1' },
    item2: { control: 'text', name: 'Ítem 2' },
    itemDestructivo: { control: 'text', name: 'Ítem destructivo' },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    textoDisparador: 'Menú',
    etiqueta: 'Mi cuenta',
    item1: 'Perfil',
    item2: 'Configuración',
    itemDestructivo: 'Cerrar sesión',
  },
  render: ({
    textoDisparador,
    etiqueta,
    item1,
    item2,
    itemDestructivo,
    ...root
  }) => (
    <DropdownMenu {...root}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{textoDisparador}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>{etiqueta}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{item1}</DropdownMenuItem>
        <DropdownMenuItem>{item2}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          {itemDestructivo}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
