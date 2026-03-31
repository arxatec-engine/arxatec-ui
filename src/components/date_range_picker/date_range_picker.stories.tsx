import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps } from 'react'
import { DateRangePicker } from './index'

const meta = {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    optional: { control: 'boolean' },
    errorMessage: { control: 'text' },
    onStartDateChange: { table: { disable: true } },
    onDueDateChange: { table: { disable: true } },
    startDate: { table: { disable: true } },
    dueDate: { table: { disable: true } },
  },
  args: {
    onStartDateChange: () => {},
    onDueDateChange: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DateRangePicker>

export default meta

type Story = StoryObj<typeof meta>

function Stateful(args: ComponentProps<typeof DateRangePicker>) {
  const [start, setStart] = useState<Date | undefined>(args.startDate)
  const [due, setDue] = useState<Date | undefined>(args.dueDate)
  return (
    <DateRangePicker
      {...args}
      startDate={start}
      dueDate={due}
      onStartDateChange={setStart}
      onDueDateChange={setDue}
    />
  )
}

export const Default: Story = {
  render: (args) => <Stateful {...args} />,
  args: {
    label: 'Periodo',
    optional: true,
  },
}

export const ConError: Story = {
  render: (args) => <Stateful {...args} />,
  args: {
    label: 'Fechas',
    errorMessage: 'La fecha de fin debe ser posterior al inicio.',
  },
}
