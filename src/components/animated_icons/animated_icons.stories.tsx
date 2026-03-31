import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  CalendarDaysIcon,
  ChartPieIcon,
  CircleHelpIcon,
  FoldersIcon,
  LayersIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  UsersIcon,
} from './index'

const meta = {
  title: 'Components/AnimatedIcons',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    gap: { control: 'text', description: 'Clase gap del contenedor (ej. gap-6)' },
    classNameFila: {
      control: 'text',
      description: 'Clases del contenedor flex',
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Galeria: Story = {
  args: {
    gap: 'gap-6',
    classNameFila: 'flex max-w-lg flex-wrap items-center justify-center text-primary',
  },
  render: ({ gap, classNameFila }) => (
    <div className={`${classNameFila} ${gap}`}>
      <UsersIcon className="text-foreground" />
      <SearchIcon />
      <LayersIcon />
      <FoldersIcon />
      <SlidersHorizontalIcon />
      <ChartPieIcon />
      <CalendarDaysIcon />
      <CircleHelpIcon />
      <PanelLeftCloseIcon />
      <PanelLeftOpenIcon />
      <SparklesIcon />
    </div>
  ),
}
