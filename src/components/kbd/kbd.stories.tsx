import type { Meta, StoryObj } from '@storybook/react-vite'

import { classNameControl } from '@/utilities/storybook_controls'
import { Kbd, KbdGroup } from './index'

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    ...classNameControl,
    children: { control: 'text', description: 'Texto de la tecla' },
  },
} satisfies Meta<typeof Kbd>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: '⌘' },
}

export const Atajo: Story = {
  render: () => (
    <KbdGroup className="flex items-center gap-1">
      <Kbd>Ctrl</Kbd>
      <span className="text-muted-foreground text-xs">+</span>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
}
