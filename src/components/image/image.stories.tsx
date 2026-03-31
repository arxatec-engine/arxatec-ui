import type { Meta, StoryObj } from '@storybook/react-vite'
import { Image } from './index'

const meta = {
  title: 'Components/Image',
  component: Image,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    className: { control: 'text' },
    classNameImage: { control: 'text' },
    errorImage: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className="h-40 w-64 overflow-hidden rounded-md border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Image>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    src: 'https://picsum.photos/id/237/400/300',
    alt: 'Ejemplo',
    className: 'h-full w-full',
    classNameImage: 'h-full w-full',
  },
}

export const SrcInvalido: Story = {
  args: {
    src: '',
    alt: 'Fallback',
    className: 'h-full w-full',
    classNameImage: 'h-full w-full',
  },
}
