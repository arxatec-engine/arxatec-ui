import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronDown } from 'lucide-react'

import { classNameControl } from '@/utilities/storybook_controls'
import { Button } from '../button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './index'

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    ...classNameControl,
    defaultOpen: { control: 'boolean' },
    disabled: { control: 'boolean' },
    textoDisparador: { control: 'text', name: 'Texto del disparador' },
    textoContenido: { control: 'text', name: 'Contenido' },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultOpen: false,
    textoDisparador: 'Mostrar más',
    textoContenido:
      'Contenido colapsable que se muestra u oculta al pulsar el disparador.',
  },
  render: ({ textoDisparador, textoContenido, ...root }) => (
    <Collapsible {...root}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full justify-between">
          {textoDisparador}
          <ChevronDown className="size-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="text-muted-foreground pt-2 text-sm">
        {textoContenido}
      </CollapsibleContent>
    </Collapsible>
  ),
}
