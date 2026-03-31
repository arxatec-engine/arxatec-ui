import type { Meta, StoryObj } from '@storybook/react-vite'

import { classNameControl } from '@/utilities/storybook_controls'
import { Calendar } from './index'

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    ...classNameControl,
    mode: { control: 'select', options: ['single', 'multiple', 'range'] },
    numberOfMonths: { control: { type: 'number', min: 1, max: 3 } },
    showOutsideDays: { control: 'boolean' },
    captionLayout: {
      control: 'select',
      options: ['label', 'dropdown', 'dropdown-months', 'dropdown-years'],
    },
    buttonVariant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Calendar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    mode: 'single',
  },
}

export const Rango: Story = {
  args: {
    mode: 'range',
    numberOfMonths: 2,
  },
}
