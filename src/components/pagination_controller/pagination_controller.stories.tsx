import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import type { Pagination as PaginationState } from '@/types'
import { PaginationController } from './index'

type PaginationControllerStoryArgs = {
  page?: number
  limit?: number
  total?: number
}

const meta = {
  title: 'Components/PaginationController',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    page: { control: { type: 'number', min: 1 } },
    limit: { control: 'number' },
    total: { control: 'number' },
  },
} satisfies Meta<PaginationControllerStoryArgs>

export default meta

type Story = StoryObj<PaginationControllerStoryArgs>

function Stateful(initial: PaginationState) {
  const [pagination, setPagination] = useState(initial)
  return (
    <div className="space-y-2 text-center">
      <PaginationController
        pagination={pagination}
        setPage={(page) =>
          setPagination((p) => ({
            ...p,
            page: Math.min(Math.max(1, page), p.total_pages),
          }))
        }
      />
      <p className="text-muted-foreground text-xs">
        Página {pagination.page} de {pagination.total_pages}
      </p>
    </div>
  )
}

export const Default: Story = {
  args: {
    page: 2,
    limit: 10,
    total: 87,
  },
  render: ({ page = 1, limit = 10, total = 0 }) => {
    const total_pages = Math.max(1, Math.ceil(total / limit))
    return (
      <Stateful
        page={Math.min(page, total_pages)}
        limit={limit}
        total={total}
        total_pages={total_pages}
      />
    )
  },
}
