import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'

import { Button } from '../button'
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
