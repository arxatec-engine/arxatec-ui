import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './index'

const meta = {
  title: 'Components/Card',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    titulo: { control: 'text', name: 'Título' },
    descripcion: { control: 'text', name: 'Descripción' },
    cuerpo: { control: 'text', name: 'Cuerpo' },
    etiquetaBoton: { control: 'text', name: 'Texto del botón' },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    titulo: 'Título de la tarjeta',
    descripcion: 'Descripción breve del contenido.',
    cuerpo: 'Cuerpo con texto de ejemplo.',
    etiquetaBoton: 'Acción',
  },
  render: (args) => (
    <Card>
      <CardHeader>
        <CardTitle>{args.titulo}</CardTitle>
        <CardDescription>{args.descripcion}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{args.cuerpo}</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">{args.etiquetaBoton}</Button>
      </CardFooter>
    </Card>
  ),
}
