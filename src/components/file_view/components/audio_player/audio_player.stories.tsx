import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileAudioPlayer } from "./index";
import { FilePreviewPlayground } from "../file_preview_playground";

const SAMPLE_AUDIO =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const meta = {
  title: "FileView/AudioPlayer",
  component: FileAudioPlayer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Reproductor de audio con controles de volumen y descarga.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onDownload: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="h-64 w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileAudioPlayer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: SAMPLE_AUDIO,
    fileName: "ejemplo-audio.mp3",
    onDownload: () => {},
  },
};

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FilePreviewPlayground
      accept="audio/*"
      defaultUrl={SAMPLE_AUDIO}
      hint="Sube un audio local o pega la URL de un audio."
    >
      {({ url, fileName }) => (
        <FileAudioPlayer url={url} fileName={fileName} onDownload={() => {}} />
      )}
    </FilePreviewPlayground>
  ),
};
