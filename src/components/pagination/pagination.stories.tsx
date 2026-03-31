import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './index'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    paginaActiva: { control: 'text', name: 'Página activa (número mostrado)' },
    pagina2: { control: 'text' },
    pagina3: { control: 'text' },
    mostrarElipsis: { control: 'boolean', name: 'Mostrar elipsis' },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    paginaActiva: '1',
    pagina2: '2',
    pagina3: '3',
    mostrarElipsis: true,
  },
  render: ({ paginaActiva, pagina2, pagina3, mostrarElipsis }) => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            {paginaActiva}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">{pagina2}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">{pagina3}</PaginationLink>
        </PaginationItem>
        {mostrarElipsis ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}
