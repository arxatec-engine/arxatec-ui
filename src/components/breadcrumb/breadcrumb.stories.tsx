import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './index'

type BreadcrumbStoryArgs = {
  segmento1?: string
  segmento2?: string
  paginaActual?: string
}

const meta = {
  title: 'Components/Breadcrumb',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    segmento1: { control: 'text', name: 'Primer segmento' },
    segmento2: { control: 'text', name: 'Segundo segmento' },
    paginaActual: { control: 'text', name: 'Página actual' },
  },
} satisfies Meta<BreadcrumbStoryArgs>

export default meta

type Story = StoryObj<BreadcrumbStoryArgs>

export const Default: Story = {
  args: {
    segmento1: 'Inicio',
    segmento2: 'Proyectos',
    paginaActual: 'Detalle',
  },
  render: ({ segmento1, segmento2, paginaActual }) => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">{segmento1}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">{segmento2}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{paginaActual}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}
