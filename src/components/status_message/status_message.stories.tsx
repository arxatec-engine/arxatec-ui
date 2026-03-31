import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertCircle } from 'lucide-react'

import { StatusMessage } from './index'

const meta = {
  title: 'Components/StatusMessage',
  component: StatusMessage,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'select', options: ['rose', 'white'] },
    size: { control: 'select', options: ['sm', 'md'] },
    title: { control: 'text' },
    description: { control: 'text' },
    classNameCard: { control: 'text' },
    classNameIconCard: { control: 'text' },
    classNameTitle: { control: 'text' },
    classNameDescription: { control: 'text' },
    icon: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatusMessage>

export default meta

type Story = StoryObj<typeof meta>

export const Error: Story = {
  args: {
    title: 'No se pudo cargar',
    description: 'Revisa tu conexión e inténtalo de nuevo.',
    color: 'rose',
    icon: AlertCircle,
  },
}

export const Vacio: Story = {
  args: {
    title: 'Sin datos',
    description: 'Aún no hay elementos para mostrar.',
    color: 'white',
    size: 'sm',
  },
}
