import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '../button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog'
import { MapPicker } from './index'

const meta = {
  title: 'Components/MapPicker',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    textoBoton: { control: 'text', name: 'Texto del botón' },
    titulo: { control: 'text', name: 'Título del diálogo' },
    altoMapa: { control: 'text', description: 'ej. h-[400px]' },
    classNameMapa: { control: 'text', name: 'Clase del MapPicker' },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const EnDialogo: Story = {
  args: {
    textoBoton: 'Abrir mapa',
    titulo: 'Elegir ubicación',
    altoMapa: 'h-[400px]',
    classNameMapa: 'h-full',
  },
  render: function MapPickerDemo({
    textoBoton,
    titulo,
    altoMapa,
    classNameMapa,
  }) {
    const [open, setOpen] = useState(false)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">{textoBoton}</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{titulo}</DialogTitle>
          </DialogHeader>
          <div className={`${altoMapa} w-full min-h-[320px]`}>
            <MapPicker
              className={classNameMapa}
              onConfirm={() => setOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    )
  },
}
