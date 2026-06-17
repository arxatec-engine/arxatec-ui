import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileVideoPlayer } from "./index";
import { FilePreviewPlayground } from "../file_preview_playground";

const SAMPLE_VIDEO =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const meta = {
  title: "FileView/VideoPlayer",
  component: FileVideoPlayer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Reproductor de video con controles personalizados y pantalla completa.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    url: SAMPLE_VIDEO,
    fileName: "video-ejemplo.mp4",
    onDownload: () => {},
  },
  argTypes: {
    onDownload: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="h-[480px] w-full bg-black">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileVideoPlayer>;

export default meta;

type Story = StoryObj<typeof FileVideoPlayer>;

export const Default: Story = {
  args: {
    url: SAMPLE_VIDEO,
    fileName: "video-ejemplo.mp4",
    onDownload: () => {},
  },
};

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  args: {
    url: SAMPLE_VIDEO,
    fileName: "video-ejemplo.mp4",
    onDownload: () => {},
  },
  render: () => (
    <FilePreviewPlayground
      accept="video/*"
      defaultUrl={SAMPLE_VIDEO}
      hint="Sube un video local o pega la URL de un video."
    >
      {({ url, fileName }) => (
        <FileVideoPlayer url={url} fileName={fileName} onDownload={() => {}} />
      )}
    </FilePreviewPlayground>
  ),
};
