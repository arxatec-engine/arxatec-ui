import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './index'

type ResizableStoryArgs = {
  direction?: 'horizontal' | 'vertical'
  panelAText?: string
  panelBText?: string
  defaultSizeA?: number
}

const meta = {
  title: 'Components/Resizable',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['horizontal', 'vertical'] },
    panelAText: { control: 'text', name: 'Texto panel A' },
    panelBText: { control: 'text', name: 'Texto panel B' },
    defaultSizeA: { control: { type: 'range', min: 20, max: 80 } },
  },
  decorators: [
    (Story) => (
      <div className="h-48 w-full max-w-lg rounded-md border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<ResizableStoryArgs>

export default meta

type Story = StoryObj<ResizableStoryArgs>

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    panelAText: 'Panel A',
    panelBText: 'Panel B',
    defaultSizeA: 40,
  },
  render: ({
    direction = 'horizontal',
    panelAText,
    panelBText,
    defaultSizeA = 40,
  }) => (
    <ResizablePanelGroup direction={direction} className="h-full">
      <ResizablePanel defaultSize={defaultSizeA} minSize={20}>
        <div className="bg-muted/50 flex h-full items-center justify-center text-sm">
          {panelAText}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={100 - defaultSizeA} minSize={20}>
        <div className="flex h-full items-center justify-center text-sm">
          {panelBText}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}
