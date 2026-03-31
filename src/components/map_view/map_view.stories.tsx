import type { Meta, StoryObj } from '@storybook/react-vite'
import { MapView } from './index'

const meta = {
  title: 'Components/MapView',
  component: MapView,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    lat: { control: { type: 'number', step: 0.0001 } },
    lng: { control: { type: 'number', step: 0.0001 } },
    zoom: { control: { type: 'range', min: 1, max: 18 } },
    height: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-lg rounded-md border overflow-hidden">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MapView>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    lat: 19.4326,
    lng: -99.1332,
    zoom: 13,
    height: 280,
  },
}
