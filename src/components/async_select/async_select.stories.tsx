import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps } from 'react'
import { AsyncSelect } from './index'

const opciones = [
  { id: '1', name: 'Opción uno' },
  { id: '2', name: 'Opción dos' },
  { id: '3', name: 'Opción tres' },
]

const meta = {
  title: 'Components/AsyncSelect',
  component: AsyncSelect,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    showAllOption: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    isError: { control: 'boolean' },
    disabled: { control: 'boolean' },
    options: { control: 'object' },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AsyncSelect>

export default meta

type Story = StoryObj<typeof meta>

function Stateful(args: ComponentProps<typeof AsyncSelect>) {
  const [value, setValue] = useState<string | undefined>(args.value)
  return (
    <AsyncSelect
      {...args}
      value={value}
      onChange={setValue}
      placeholder={args.placeholder}
      options={args.options}
    />
  )
}

export const Default: Story = {
  render: (args) => <Stateful {...args} />,
  args: {
    label: 'Seleccionar',
    placeholder: 'Elegir…',
    options: opciones,
    showAllOption: true,
    onChange: () => {},
  },
}

export const Cargando: Story = {
  render: (args) => <Stateful {...args} />,
  args: {
    placeholder: 'Cargando…',
    options: [],
    isLoading: true,
    onChange: () => {},
  },
}

export const Error: Story = {
  render: (args) => <Stateful {...args} />,
  args: {
    placeholder: 'Estado',
    options: [],
    isError: true,
    onChange: () => {},
  },
}
