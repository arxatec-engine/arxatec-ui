import type { Meta, StoryObj } from '@storybook/react-vite'
import { AvatarInput } from './index'

const meta = {
  title: 'Components/AvatarInput',
  component: AvatarInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    fullName: { control: 'text' },
    label: { control: 'text' },
    className: { control: 'text' },
    defaultAvatar: { control: 'text' },
    onAvatarChange: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AvatarInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    fullName: 'María García López',
    onAvatarChange: () => {},
    label: 'Foto de perfil',
  },
}

export const ConAvatarPorDefecto: Story = {
  args: {
    fullName: 'Juan Pérez',
    onAvatarChange: () => {},
    defaultAvatar: 'https://github.com/shadcn.png',
  },
}
