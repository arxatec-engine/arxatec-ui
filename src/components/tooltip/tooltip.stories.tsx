import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'

import { Button } from '../button'
import { Tooltip, TooltipContent, TooltipTrigger } from './index'

type TooltipStoryArgs = ComponentProps<typeof Tooltip> & {
  textoDisparador?: string
  textoAyuda?: string
}

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    textoDisparador: { control: 'text', name: 'Texto del botón' },
    textoAyuda: { control: 'text', name: 'Texto del tooltip' },
  },
} satisfies Meta<TooltipStoryArgs>

export default meta

type Story = StoryObj<TooltipStoryArgs>

export const Default: Story = {
  args: {
    textoDisparador: 'Pasar el cursor',
    textoAyuda: 'Ayuda contextual breve.',
  },
  render: ({ textoDisparador, textoAyuda, ...root }) => (
    <Tooltip {...root}>
      <TooltipTrigger asChild>
        <Button variant="outline" size="sm">
          {textoDisparador}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{textoAyuda}</p>
      </TooltipContent>
    </Tooltip>
  ),
}
