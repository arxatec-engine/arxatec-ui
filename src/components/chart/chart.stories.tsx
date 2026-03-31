import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import { classNameControl } from '@/utilities/storybook_controls'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from './index'

const config = {
  total: {
    label: 'Total',
    color: 'var(--chart-1)',
  },
}

const meta = {
  title: 'Components/Chart',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    ...classNameControl,
    alturaMinima: {
      control: 'text',
      description: 'Clase min-height del contenedor (ej. min-h-[220px])',
    },
    radioBarras: { control: { type: 'range', min: 0, max: 16 } },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-lg p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const datosDefault = [
  { mes: 'Ene', total: 120 },
  { mes: 'Feb', total: 200 },
  { mes: 'Mar', total: 150 },
  { mes: 'Abr', total: 280 },
]

export const Barras: Story = {
  args: {
    alturaMinima: 'min-h-[220px]',
    radioBarras: 4,
  },
  render: ({ alturaMinima, radioBarras = 4, className }) => (
    <ChartContainer
      config={config}
      className={`${alturaMinima} w-full ${className ?? ''}`}
    >
      <BarChart accessibilityLayer data={datosDefault}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="mes"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
        <Bar dataKey="total" fill="var(--color-total)" radius={radioBarras} />
      </BarChart>
    </ChartContainer>
  ),
}
