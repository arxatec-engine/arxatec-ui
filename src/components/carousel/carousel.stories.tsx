import type { Meta, StoryObj } from '@storybook/react-vite'

import { classNameControl } from '@/utilities/storybook_controls'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './index'

const meta = {
  title: 'Components/Carousel',
  component: Carousel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    ...classNameControl,
    opts: { control: 'object', description: 'Opciones de embla-carousel (opts)' },
    itemCount: { control: { type: 'number', min: 1, max: 8 } },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs pl-12 pr-12">
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    itemCount: 3,
    orientation: 'horizontal',
  },
  render: ({ itemCount = 3, orientation, ...root }) => (
    <Carousel orientation={orientation} {...root}>
      <CarouselContent>
        {Array.from({ length: itemCount }, (_, i) => (
          <CarouselItem key={i}>
            <div className="bg-muted flex aspect-square items-center justify-center rounded-md border text-2xl font-medium">
              {i + 1}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}
