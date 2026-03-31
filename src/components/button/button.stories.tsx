import type { Meta, StoryObj } from '@storybook/react-vite'

import { classNameControl } from '@/utilities/storybook_controls'
import { Button } from './index'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ...classNameControl,
    variant: {
      control: 'select',
      options: [
        'default',
        'outline',
        'secondary',
        'ghost',
        'destructive',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    asChild: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Botón',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secundario',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Contorno',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Eliminar',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Fantasma',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Enlace',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Pequeño',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Deshabilitado',
  },
}
