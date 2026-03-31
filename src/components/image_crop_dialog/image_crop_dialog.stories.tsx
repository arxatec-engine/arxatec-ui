import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '../button'
import { ImageCropDialog } from './index'

const meta = {
  title: 'Components/ImageCropDialog',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    imageSrc: { control: 'text' },
    textoBoton: { control: 'text', name: 'Texto del botón' },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    imageSrc: 'https://picsum.photos/id/64/600/400',
    textoBoton: 'Recortar imagen',
  },
  render: function CropPlayground({ imageSrc, textoBoton }) {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button type="button" onClick={() => setOpen(true)}>
          {textoBoton}
        </Button>
        <ImageCropDialog
          isOpen={open}
          onClose={() => setOpen(false)}
          imageSrc={imageSrc}
          onCropComplete={() => setOpen(false)}
        />
      </>
    )
  },
}
