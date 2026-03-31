import type { Meta, StoryObj } from '@storybook/react-vite'
import { InfoTooltip } from './index'

const meta = {
  title: 'Components/InfoTooltip',
  component: InfoTooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    info: { control: 'text' },
  },
} satisfies Meta<typeof InfoTooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    info: 'Texto de ayuda breve que aparece al situar el cursor sobre el icono.',
  },
}
