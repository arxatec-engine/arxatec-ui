import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import {
  Command,
  CommandInput,
} from '../command'
import { AsyncCommandList } from './index'

type AsyncCommandListStoryArgs = {
  placeholder?: string
  emptyMessage?: string
}

const meta = {
  title: 'Components/AsyncCommandList',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    emptyMessage: { control: 'text' },
  },
} satisfies Meta<AsyncCommandListStoryArgs>

export default meta

type Story = StoryObj<AsyncCommandListStoryArgs>

type Item = { id: string; name: string }

const items: Item[] = [
  { id: 'a', name: 'Primer elemento' },
  { id: 'b', name: 'Segundo elemento' },
  { id: 'c', name: 'Tercero' },
]

function ListDemo(props: {
  data: Item[]
  isLoading: boolean
  emptyMessage?: string
  placeholder?: string
}) {
  const [last, setLast] = useState<string | null>(null)
  return (
    <div className="w-full max-w-md space-y-2">
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder={props.placeholder ?? 'Buscar…'} />
        <AsyncCommandList<Item>
          data={props.data}
          isLoading={props.isLoading}
          emptyMessage={props.emptyMessage ?? 'Nada que mostrar'}
          getKey={(i) => i.id}
          renderItem={(i) => <span>{i.name}</span>}
          onSelect={setLast}
        />
      </Command>
      {last != null && (
        <p className="text-muted-foreground text-xs">Seleccionado: {last}</p>
      )}
    </div>
  )
}

export const ConDatos: Story = {
  args: { placeholder: 'Buscar…' },
  render: ({ placeholder }) => (
    <ListDemo data={items} isLoading={false} placeholder={placeholder} />
  ),
}

export const Cargando: Story = {
  args: { placeholder: 'Buscar…' },
  render: ({ placeholder }) => (
    <ListDemo data={[]} isLoading placeholder={placeholder} />
  ),
}

export const Vacio: Story = {
  args: { placeholder: 'Buscar…', emptyMessage: 'Sin resultados' },
  render: ({ placeholder, emptyMessage }) => (
    <ListDemo
      data={[]}
      isLoading={false}
      emptyMessage={emptyMessage}
      placeholder={placeholder}
    />
  ),
}
