import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'

import { Button } from '../button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../sheet'
import { Toaster } from './index'

type SonnerStoryArgs = {
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
  expand?: boolean
  closeButton?: boolean
  richColors?: boolean
  mensajeExito?: string
  mensajeError?: string
  mensajeInfo?: string
  mensajeAviso?: string
  descripcionExito?: string
  descripcionError?: string
  descripcionInfo?: string
  descripcionAviso?: string
  mensajeCargando?: string
  duracionSimulada?: number
}

const meta = {
  title: 'Components/Sonner',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
    },
    expand: { control: 'boolean' },
    closeButton: { control: 'boolean' },
    richColors: { control: 'boolean' },
    mensajeExito: { control: 'text', name: 'Mensaje éxito' },
    mensajeError: { control: 'text', name: 'Mensaje error' },
    mensajeInfo: { control: 'text', name: 'Mensaje info' },
    mensajeAviso: { control: 'text', name: 'Mensaje aviso' },
  },
  decorators: [
    (Story, context) => {
      const a = context.args
      return (
        <>
          <Story />
          <Toaster
            position={a.position}
            expand={a.expand}
            closeButton={a.closeButton}
            richColors={a.richColors}
          />
        </>
      )
    },
  ],
} satisfies Meta<SonnerStoryArgs>

export default meta

type Story = StoryObj<SonnerStoryArgs>

export const Variantes: Story = {
  args: {
    position: 'bottom-right',
    expand: false,
    closeButton: true,
    richColors: false,
    mensajeExito: 'Guardado correctamente',
    mensajeError: 'Algo salió mal',
    mensajeInfo: 'Información',
    mensajeAviso: 'Atención',
  },
  render: ({
    mensajeExito,
    mensajeError,
    mensajeInfo,
    mensajeAviso,
  }) => (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        onClick={() => toast.success(mensajeExito)}
      >
        Éxito
      </Button>
      <Button
        type="button"
        size="sm"
        variant="destructive"
        onClick={() => toast.error(mensajeError)}
      >
        Error
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => toast.info(mensajeInfo)}
      >
        Info
      </Button>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={() => toast.warning(mensajeAviso)}
      >
        Aviso
      </Button>
    </div>
  ),
}

export const ConDescripcion: Story = {
  args: {
    position: 'bottom-right',
    expand: false,
    closeButton: true,
    richColors: false,
    mensajeExito: 'Guardado correctamente',
    mensajeError: 'Algo salió mal',
    mensajeInfo: 'Información',
    mensajeAviso: 'Atención',
    descripcionExito: 'Los cambios se aplicaron en el proyecto.',
    descripcionError: 'No se pudo completar la operación. Inténtalo de nuevo.',
    descripcionInfo: 'Puedes revisar los detalles en la configuración.',
    descripcionAviso: 'Esta acción no se puede deshacer.',
  },
  argTypes: {
    descripcionExito: { control: 'text', name: 'Descripción éxito' },
    descripcionError: { control: 'text', name: 'Descripción error' },
    descripcionInfo: { control: 'text', name: 'Descripción info' },
    descripcionAviso: { control: 'text', name: 'Descripción aviso' },
  },
  render: ({
    mensajeExito,
    mensajeError,
    mensajeInfo,
    mensajeAviso,
    descripcionExito,
    descripcionError,
    descripcionInfo,
    descripcionAviso,
  }) => (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        onClick={() =>
          toast.success(mensajeExito, { description: descripcionExito })
        }
      >
        Éxito
      </Button>
      <Button
        type="button"
        size="sm"
        variant="destructive"
        onClick={() =>
          toast.error(mensajeError, { description: descripcionError })
        }
      >
        Error
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() =>
          toast.info(mensajeInfo, { description: descripcionInfo })
        }
      >
        Info
      </Button>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={() =>
          toast.warning(mensajeAviso, { description: descripcionAviso })
        }
      >
        Aviso
      </Button>
    </div>
  ),
}

const simularPromesa = (shouldFail: boolean, delayMs: number) =>
  new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error('Simulated failure'))
      else resolve()
    }, delayMs)
  })

export const PromiseToast: Story = {
  name: 'Promise',
  args: {
    position: 'bottom-right',
    expand: false,
    closeButton: true,
    richColors: false,
    mensajeCargando: 'Guardando cambios...',
    mensajeExito: 'Guardado correctamente',
    mensajeError: 'No se pudo guardar',
    duracionSimulada: 2000,
  },
  argTypes: {
    mensajeCargando: { control: 'text', name: 'Mensaje cargando' },
    duracionSimulada: {
      control: { type: 'number', min: 500, max: 5000, step: 500 },
      name: 'Duración simulada (ms)',
    },
  },
  render: ({
    mensajeCargando,
    mensajeExito,
    mensajeError,
    duracionSimulada = 2000,
  }) => (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        onClick={() =>
          toast.promise(
            simularPromesa(false, duracionSimulada),
            {
              loading: mensajeCargando,
              success: mensajeExito,
              error: mensajeError,
            },
          )
        }
      >
        Resolver
      </Button>
      <Button
        type="button"
        size="sm"
        variant="destructive"
        onClick={() =>
          toast.promise(
            simularPromesa(true, duracionSimulada),
            {
              loading: mensajeCargando,
              success: mensajeExito,
              error: mensajeError,
            },
          )
        }
      >
        Rechazar
      </Button>
    </div>
  ),
}

export const ConSheet: Story = {
  name: 'Con Sheet',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Abre el sheet, dispara un toast y comprueba que el panel sigue cerrándose (botón X, overlay o Escape).',
      },
    },
  },
  args: {
    position: 'bottom-right',
    expand: false,
    closeButton: true,
    richColors: false,
    mensajeExito: 'Guardado correctamente',
    mensajeError: 'Algo salió mal',
    mensajeInfo: 'Información',
    mensajeAviso: 'Atención',
  },
  render: ({
    mensajeExito,
    mensajeError,
    mensajeInfo,
    mensajeAviso,
  }) => (
    <div className="flex min-h-[480px] items-center justify-center p-8">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Abrir sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet con toasts</SheetTitle>
            <SheetDescription>
              Dispara un toast y luego cierra el panel con la X, el overlay o
              Escape.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-wrap gap-2 px-4">
            <Button
              type="button"
              size="sm"
              onClick={() => toast.success(mensajeExito)}
            >
              Éxito
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => toast.error(mensajeError)}
            >
              Error
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => toast.info(mensajeInfo)}
            >
              Info
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => toast.warning(mensajeAviso)}
            >
              Aviso
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  ),
}
