import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './index'

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    textoDisparador: { control: 'text', name: 'Texto del botón' },
    titulo: { control: 'text' },
    descripcion: { control: 'text' },
    textoCerrar: { control: 'text', name: 'Cerrar' },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    textoDisparador: 'Abrir panel',
    titulo: 'Detalle',
    descripcion: 'Contenido deslizable desde el borde inferior.',
    textoCerrar: 'Cerrar',
  },
  render: ({
    textoDisparador,
    titulo,
    descripcion,
    textoCerrar,
    ...root
  }) => (
    <Drawer {...root}>
      <DrawerTrigger asChild>
        <Button variant="outline">{textoDisparador}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{titulo}</DrawerTitle>
          <DrawerDescription>{descripcion}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">{textoCerrar}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
