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
          "Video sin recortes y barra flotante que se oculta tras 2,5 segundos sin actividad, también en pausa. Ratón, toque y teclado vuelven a mostrar los controles.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    url: SAMPLE_VIDEO,
    fileName: "video-ejemplo.mp4",
  },
  argTypes: {
    onDownload: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="h-[min(640px,100svh)] w-full">
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
  },
};

export const PanelEstrecho: Story = {
  render: (args) => (
    <div className="mx-auto h-full w-full max-w-[360px] border-x border-border">
      <FileVideoPlayer {...args} />
    </div>
  ),
};

export const Error: Story = {
  args: {
    url: "data:video/mp4;base64,AAAA",
    fileName: "video-no-disponible.mp4",
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
