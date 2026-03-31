import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'

import { Button } from '../button'
import { Popover, PopoverContent, PopoverTrigger } from './index'

type PopoverStoryArgs = ComponentProps<typeof Popover> & {
  textoBoton?: string
  textoContenido?: string
}

const meta = {
  title: 'Components/Popover',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  component: Popover,
  argTypes: {
    textoBoton: { control: 'text', name: 'Texto del botón' },
    textoContenido: { control: 'text', name: 'Contenido' },
  },
} satisfies Meta<PopoverStoryArgs>

export default meta

type Story = StoryObj<PopoverStoryArgs>

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
