import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps } from 'react'
import { FileDropZone } from './index'

const meta = {
  title: 'Components/FileDropZone',
  component: FileDropZone,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    maxFiles: { control: 'number' },
    maxFileSize: { control: 'number', description: 'Bytes máx. por archivo' },
    acceptedTypes: { control: 'object' },
    className: { control: 'text' },
    onFilesChange: { table: { disable: true } },
    files: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileDropZone>

export default meta

type Story = StoryObj<typeof meta>

function Stateful(props: ComponentProps<typeof FileDropZone>) {
  const [files, setFiles] = useState<File[]>(props.files ?? [])
  return (
    <FileDropZone
      {...props}
      files={files}
      onFilesChange={(next) => {
        setFiles(next)
        props.onFilesChange(next)
      }}
    />
  )
}

export const Default: Story = {
  render: (args) => <Stateful {...args} />,
  args: {
    onFilesChange: () => {},
    multiple: true,
  },
}

export const SoloImagenes: Story = {
  render: (args) => <Stateful {...args} />,
  args: {
    onFilesChange: () => {},
    acceptedTypes: ['image/jpeg', 'image/png'],
    maxFiles: 3,
  },
}
