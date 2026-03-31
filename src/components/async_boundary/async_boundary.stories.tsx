import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'

import { AsyncBoundary } from './index'

type AsyncBoundaryStoryArgs = ComponentProps<typeof AsyncBoundary> & {
  textoLoading?: string
  textoError?: string
  textoDatos?: string
  textoVacio?: string
}

const meta = {
  title: 'Components/AsyncBoundary',
  component: AsyncBoundary,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    textoLoading: { control: 'text' },
    textoError: { control: 'text' },
    textoDatos: { control: 'text', name: 'Mensaje con datos' },
    textoVacio: { control: 'text', name: 'Texto lista vacía' },
  },
} satisfies Meta<AsyncBoundaryStoryArgs>

export default meta

type Story = StoryObj<AsyncBoundaryStoryArgs>

export const ConDatos: Story = {
  args: {
    textoDatos: 'Hola',
  },
  render: ({ textoDatos }) => (
    <AsyncBoundary
      isLoading={false}
      isError={false}
      data={{ mensaje: textoDatos ?? '' }}
      LoadingComponent={<p>Cargando…</p>}
      ErrorComponent={<p>Error</p>}
    >
      {(d: { mensaje: string }) => (
        <p className="text-sm">{d.mensaje}</p>
      )}
    </AsyncBoundary>
  ),
}

export const Cargando: Story = {
  args: {
    textoLoading: 'Cargando…',
  },
  render: ({ textoLoading }) => (
    <AsyncBoundary
      isLoading
      isError={false}
      data={undefined}
      LoadingComponent={
        <p className="text-muted-foreground">{textoLoading ?? 'Cargando…'}</p>
      }
      ErrorComponent={<p>Error</p>}
    >
      {(d: { mensaje: string }) => <p>{d.mensaje}</p>}
    </AsyncBoundary>
  ),
}

export const Error: Story = {
  args: {
    textoError: 'No se pudo cargar',
  },
  render: ({ textoError }) => (
    <AsyncBoundary
      isLoading={false}
      isError
      data={undefined}
      LoadingComponent={<p>Cargando…</p>}
      ErrorComponent={
        <p className="text-destructive text-sm">
          {textoError ?? 'No se pudo cargar'}
        </p>
      }
    >
      {(d: { mensaje: string }) => <p>{d.mensaje}</p>}
    </AsyncBoundary>
  ),
}

export const ListaVacia: Story = {
  args: {
    textoVacio: 'Sin elementos',
  },
  render: ({ textoVacio }) => (
    <AsyncBoundary
      isLoading={false}
      isError={false}
      data={[]}
      EmptyComponent={
        <p className="text-muted-foreground text-sm">
          {textoVacio ?? 'Sin elementos'}
        </p>
      }
      LoadingComponent={<p>Cargando…</p>}
      ErrorComponent={<p>Error</p>}
    >
      {(items: unknown[]) => <p>{items.length} elementos</p>}
    </AsyncBoundary>
  ),
}
