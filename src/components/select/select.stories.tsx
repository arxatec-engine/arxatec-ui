import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './index'

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: { control: 'text', description: 'Valor inicial' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="w-56">
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: 'dos',
    placeholder: 'Elegir',
    disabled: false,
  },
  render: ({ defaultValue, placeholder, disabled, ...root }) => (
    <Select defaultValue={defaultValue} disabled={disabled} {...root}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="uno">Uno</SelectItem>
        <SelectItem value="dos">Dos</SelectItem>
        <SelectItem value="tres">Tres</SelectItem>
      </SelectContent>
    </Select>
  ),
}
