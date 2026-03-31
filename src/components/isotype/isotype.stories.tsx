import type { Meta, StoryObj } from '@storybook/react-vite'
import { Isotype } from './index'

const meta = {
  title: 'Components/Isotype',
  component: Isotype,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
  },
} satisfies Meta<typeof Isotype>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    className: 'size-24 text-primary',
  },
}
