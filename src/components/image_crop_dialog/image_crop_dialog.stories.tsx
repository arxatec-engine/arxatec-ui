import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '../button'
import { ImageCropDialog } from './index'

type ImageCropDialogStoryArgs = {
  imageSrc?: string
  textoBoton?: string
}

const meta = {
  title: 'Components/ImageCropDialog',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    imageSrc: { control: 'text' },
    textoBoton: { control: 'text', name: 'Texto del botón' },
  },
} satisfies Meta<ImageCropDialogStoryArgs>

export default meta

type Story = StoryObj<ImageCropDialogStoryArgs>

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
          imageSrc={imageSrc ?? ''}
          onCropComplete={() => setOpen(false)}
        />
      </>
    )
  },
}
