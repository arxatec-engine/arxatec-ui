import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../button'
import { Popover, PopoverContent, PopoverTrigger } from './index'

const meta = {
  title: 'Components/Popover',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  component: Popover,
  argTypes: {
    textoBoton: { control: 'text', name: 'Texto del botón' },
    textoContenido: { control: 'text', name: 'Contenido' },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    textoBoton: 'Abrir',
    textoContenido: 'Contenido emergente del popover.',
  },
  render: ({ textoBoton, textoContenido, ...root }) => (
    <Popover {...root}>
      <PopoverTrigger asChild>
        <Button variant="outline">{textoBoton}</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm">{textoContenido}</p>
      </PopoverContent>
    </Popover>
  ),
}
