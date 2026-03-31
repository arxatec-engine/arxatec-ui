import type { Meta, StoryObj } from '@storybook/react-vite'

import { classNameControl } from '@/utilities/storybook_controls'
import { Input } from './index'

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    ...classNameControl,
    size: { control: 'select', options: ['default', 'sm'] },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'search', 'number', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Escribe algo…',
  },
}

export const Pequeño: Story = {
  args: {
    size: 'sm',
    placeholder: 'Tamaño sm',
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Contraseña',
  },
}

export const Deshabilitado: Story = {
  args: {
    disabled: true,
    placeholder: 'No editable',
  },
}
