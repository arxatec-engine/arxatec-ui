import type { Meta, StoryObj } from '@storybook/react-vite'

import { AsyncBoundary } from './index'

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
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ConDatos: Story = {
  args: {
    textoDatos: 'Hola',
  },
  render: ({ textoDatos }) => (
    <AsyncBoundary
      isLoading={false}
      isError={false}
      data={{ mensaje: textoDatos }}
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
      LoadingComponent={<p className="text-muted-foreground">{textoLoading}</p>}
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
        <p className="text-destructive text-sm">{textoError}</p>
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
      EmptyComponent={<p className="text-muted-foreground text-sm">{textoVacio}</p>}
      LoadingComponent={<p>Cargando…</p>}
      ErrorComponent={<p>Error</p>}
    >
      {(items: unknown[]) => <p>{items.length} elementos</p>}
    </AsyncBoundary>
  ),
}
