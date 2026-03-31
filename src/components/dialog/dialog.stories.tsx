import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './index'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    textoDisparador: { control: 'text', name: 'Texto del botón' },
    titulo: { control: 'text' },
    descripcion: { control: 'text' },
    textoCancelar: { control: 'text', name: 'Cancelar' },
    textoConfirmar: { control: 'text', name: 'Confirmar' },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    textoDisparador: 'Abrir diálogo',
    titulo: 'Confirmar acción',
    descripcion:
      'Esta acción no se puede deshacer. ¿Continuar?',
    textoCancelar: 'Cancelar',
    textoConfirmar: 'Confirmar',
  },
  render: ({
    textoDisparador,
    titulo,
    descripcion,
    textoCancelar,
    textoConfirmar,
    ...root
  }) => (
    <Dialog {...root}>
      <DialogTrigger asChild>
        <Button variant="outline">{textoDisparador}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>{descripcion}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline">{textoCancelar}</Button>
          <Button>{textoConfirmar}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
