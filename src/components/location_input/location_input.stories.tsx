import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps } from 'react'
import { LocationInput } from './index'
import type { LocationData } from '../map_picker'

const meta = {
  title: 'Components/LocationInput',
  component: LocationInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['default', 'sm'] },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LocationInput>

export default meta

type Story = StoryObj<typeof meta>

function Stateful(args: ComponentProps<typeof LocationInput>) {
  const [value, setValue] = useState<LocationData | undefined>(args.value)
  return <LocationInput {...args} value={value} onChange={setValue} />
}

export const Default: Story = {
  render: (args) => <Stateful {...args} />,
}

export const ConValor: Story = {
  render: () => {
    const [value, setValue] = useState<LocationData | undefined>({
      lat: 19.4326,
      lng: -99.1332,
      address: 'Ciudad de México, CDMX',
    })
    return <LocationInput value={value} onChange={setValue} />
  },
}
