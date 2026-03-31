import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'

import { LoaderSplash } from './index'

type LoaderSplashStoryArgs = ComponentProps<typeof LoaderSplash> & {
  classNameContenedor?: string
}

const meta = {
  title: 'Components/LoaderSplash',
  component: LoaderSplash,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'Sin props públicos. Usa el interruptor **Tema** en la barra para claro/oscuro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    classNameContenedor: {
      control: 'text',
      description: 'Clases del contenedor alrededor del splash (solo Storybook)',
    },
  },
} satisfies Meta<LoaderSplashStoryArgs>

export default meta

type Story = StoryObj<LoaderSplashStoryArgs>

export const Default: Story = {
  args: {
    classNameContenedor: 'min-h-screen bg-background',
  },
  render: ({ classNameContenedor }) => (
    <div className={classNameContenedor}>
      <LoaderSplash />
    </div>
  ),
}
