import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  GoogleDriveIcon,
  GoogleIsotype,
  MicrosoftIsotype,
  OneDriveIcon,
} from './index'

type IconsStoryArgs = {
  classNameIcono?: string
}

const meta = {
  title: 'Components/Icons',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    classNameIcono: {
      control: 'text',
      description: 'Clases aplicadas a cada icono',
    },
  },
} satisfies Meta<IconsStoryArgs>

export default meta

type Story = StoryObj<IconsStoryArgs>

export const Marcas: Story = {
  args: {
    classNameIcono: 'size-12 text-foreground',
  },
  render: ({ classNameIcono }) => (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <GoogleIsotype className={classNameIcono} />
      <MicrosoftIsotype className={classNameIcono} />
      <GoogleDriveIcon className={classNameIcono} />
      <OneDriveIcon className={classNameIcono} />
    </div>
  ),
}
