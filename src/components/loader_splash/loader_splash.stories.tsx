import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoaderSplash } from './index'

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
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

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
