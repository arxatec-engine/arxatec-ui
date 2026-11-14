import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { FilePublicPreviewRender } from "./index";

const source = new URL(
  "../pptx_preview_viewer/fixtures/presentation.pptx",
  import.meta.url,
).href;

const meta = {
  title: "FileView/PublicPreviewRender",
  component: FilePublicPreviewRender,
  parameters: { layout: "fullscreen" },
  args: { fileName: "Presentación.pptx", objectUrl: null, signedUrl: source },
  decorators: [
    (Story) => (
      <div className="h-screen w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FilePublicPreviewRender>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Presentation: Story = {};

function AuthorizedBytes() {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    let localUrl: string | undefined;
    void fetch(source, { signal: controller.signal })
      .then((response) => response.blob())
      .then((blob) => {
        if (!controller.signal.aborted) {
          localUrl = URL.createObjectURL(blob);
          setObjectUrl(localUrl);
        }
      })
      .catch(() => undefined);
    return () => {
      controller.abort();
      if (localUrl) URL.revokeObjectURL(localUrl);
    };
  }, []);
  return objectUrl ? (
    <FilePublicPreviewRender
      fileName="Presentación.pptx"
      mimeType="application/octet-stream"
      objectUrl={objectUrl}
      signedUrl={null}
    />
  ) : null;
}

export const AuthorizedPresentation: Story = {
  render: () => <AuthorizedBytes />,
};
