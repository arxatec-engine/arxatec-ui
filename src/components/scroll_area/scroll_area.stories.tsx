import type { Meta, StoryObj } from '@storybook/react-vite'

import { classNameControl } from '@/utilities/storybook_controls'
import { ScrollArea } from './index'

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    ...classNameControl,
    itemCount: {
      control: 'number',
      description: 'Número de filas de ejemplo',
      name: 'Elementos',
    },
  },
  decorators: [
    (Story) => (
      <div className="h-48 w-64 rounded-md border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { itemCount: 24 },
  render: ({ itemCount = 24, ...args }) => (
    <ScrollArea className="h-full" {...args}>
      <div className="space-y-2 p-4">
        {Array.from({ length: itemCount }, (_, i) => (
          <p key={i} className="text-sm">
            Elemento de lista {i + 1}
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
}
