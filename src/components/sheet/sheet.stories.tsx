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
  side?: ComponentProps<typeof SheetContent>['side']
  claseContenido?: string
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
    side: {
      control: 'select',
      options: ['right', 'left', 'top', 'bottom'],
      name: 'Lado',
    },
    claseContenido: { control: 'text', name: 'Clases del contenido' },
  },
  args: {
    textoDisparador: 'Abrir hoja',
    titulo: 'Título',
    descripcion: 'Panel flotante con espacio exterior y esquinas redondeadas.',
    side: 'right',
  },
  render: ({ textoDisparador, titulo, descripcion, side, claseContenido, ...root }) => (
    <Sheet {...root}>
      <SheetTrigger asChild>
        <Button variant="outline">{textoDisparador}</Button>
      </SheetTrigger>
      <SheetContent side={side} className={claseContenido}>
        <SheetHeader>
          <SheetTitle>{titulo}</SheetTitle>
          <SheetDescription>{descripcion}</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
} satisfies Meta<SheetStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Derecha: Story = {}

export const Izquierda: Story = {
  args: { side: 'left' },
}

export const Arriba: Story = {
  args: { side: 'top' },
}

export const Abajo: Story = {
  args: { side: 'bottom' },
}

export const AnchoCompleto: Story = {
  args: { claseContenido: 'w-full sm:max-w-[95vw]' },
}
