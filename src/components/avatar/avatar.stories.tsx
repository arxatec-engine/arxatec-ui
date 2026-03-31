import type { Meta, StoryObj } from '@storybook/react-vite'

import { classNameControl } from '@/utilities/storybook_controls'
import { Avatar, AvatarFallback, AvatarImage } from './index'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    ...classNameControl,
    src: { control: 'text', table: { category: 'AvatarImage' } },
    alt: { control: 'text', table: { category: 'AvatarImage' } },
    fallback: { control: 'text', description: 'Texto del fallback' },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ConImagen: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'Usuario',
    fallback: 'CN',
  },
  render: ({ src, alt, fallback, ...root }) => (
    <Avatar {...root}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  ),
}

export const Fallback: Story = {
  args: {
    fallback: 'AB',
    className: '',
  },
  argTypes: {
    src: { table: { disable: true } },
    alt: { table: { disable: true } },
  },
  render: ({ fallback, ...root }) => (
    <Avatar {...root}>
      <AvatarFallback className="text-xs font-medium">{fallback}</AvatarFallback>
    </Avatar>
  ),
}
