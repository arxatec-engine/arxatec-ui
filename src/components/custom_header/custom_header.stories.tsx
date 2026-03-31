import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus } from 'lucide-react'
import { CustomHeader } from './index'

const meta = {
  title: 'Components/CustomHeader',
  component: CustomHeader,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    button: { control: 'object', description: '{ label, url, icon }' },
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CustomHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Panel principal',
    description: 'Vista resumida de la actividad reciente.',
  },
}

export const ConBoton: Story = {
  args: {
    title: 'Documentos',
    description: 'Gestiona archivos del proyecto.',
    button: {
      label: 'Nuevo',
      url: '#',
      icon: Plus,
    },
  },
}
