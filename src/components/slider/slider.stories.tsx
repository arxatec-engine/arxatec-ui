import type { Meta, StoryObj } from '@storybook/react-vite'

import { classNameControl } from '@/utilities/storybook_controls'
import { Slider } from './index'

const meta = {
  title: 'Components/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    ...classNameControl,
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
  decorators: [
    (Story) => (
      <div className="w-64 pt-4 pb-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: [40],
    max: 100,
    step: 1,
  },
}

export const Rango: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
  },
}
