import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps } from 'react'
import { IconPicker, type IconName } from './index'

const meta = {
  title: 'Components/IconPicker',
  component: IconPicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    searchable: { control: 'boolean' },
    triggerPlaceholder: { control: 'text' },
    defaultValue: { control: 'text' },
    value: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IconPicker>

export default meta

type Story = StoryObj<typeof meta>

function Stateful(args: ComponentProps<typeof IconPicker>) {
  const [value, setValue] = useState<IconName | undefined>(args.value)
  return (
    <IconPicker
      {...args}
      value={value}
      onValueChange={(v) => {
        setValue(v)
        args.onValueChange?.(v)
      }}
    />
  )
}

export const Default: Story = {
  render: (args) => <Stateful {...args} />,
  args: {
    searchable: true,
    triggerPlaceholder: 'Elegir icono',
    defaultValue: 'activity',
  },
}
