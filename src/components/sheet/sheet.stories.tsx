import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'

import { Button } from '../button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './index'

type SheetStoryArgs = ComponentProps<typeof Sheet> & {
  textoDisparador?: string
  titulo?: string
  descripcion?: string
}

const meta = {
  title: 'Components/Sheet',
  component: Sheet,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    textoDisparador: { control: 'text', name: 'Texto del botón' },
    titulo: { control: 'text' },
    descripcion: { control: 'text' },
  },
} satisfies Meta<SheetStoryArgs>

export default meta

type Story = StoryObj<SheetStoryArgs>

export const Derecha: Story = {
  args: {
    textoDisparador: 'Abrir hoja',
    titulo: 'Título',
    descripcion: 'Panel lateral con formulario o detalle.',
  },
  render: ({ textoDisparador, titulo, descripcion, ...root }) => (
    <Sheet {...root}>
      <SheetTrigger asChild>
        <Button variant="outline">{textoDisparador}</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{titulo}</SheetTitle>
          <SheetDescription>{descripcion}</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}
