import type { Meta, StoryObj } from '@storybook/react-vite'

import { classNameControl } from '@/utilities/storybook_controls'
import { Input } from '../input'
import { Label } from './index'

const meta = {
  title: 'Components/Label',
  component: Label,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    ...classNameControl,
    htmlFor: { control: 'text' },
    children: { control: 'text', name: 'Texto de la etiqueta' },
  },
  decorators: [
    (Story) => (
      <div className="flex w-72 flex-col gap-2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    htmlFor: 'email',
    children: 'Correo',
  },
  render: (args) => (
    <>
      <Label {...args} />
      <Input id={args.htmlFor} type="email" placeholder="tu@correo.com" />
    </>
  ),
}
