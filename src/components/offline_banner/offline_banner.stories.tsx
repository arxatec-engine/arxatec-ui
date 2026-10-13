import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../button";
import { OfflineBanner, type OfflineBannerProps } from "./index";

function ConnectionExample(props: OfflineBannerProps) {
  const [isOnline, setIsOnline] = useState(true);
  return (
    <div className="grid min-h-64 place-content-center gap-3 p-12">
      <OfflineBanner {...props} isOnline={isOnline} />
      <p>Connection: {isOnline ? "online" : "offline"}</p>
      <Button onClick={() => setIsOnline((current) => !current)}>
        {isOnline ? "Disconnect" : "Reconnect"}
      </Button>
    </div>
  );
}

const meta = {
  title: "Feedback/OfflineBanner",
  component: OfflineBanner,
  args: { isOnline: false },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof OfflineBanner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Offline: Story = {};
export const ConnectionChanges: Story = {
  args: {
    labels: {
      offline: "You have no internet connection",
      reconnected: "You're back online",
      close: "Close",
    },
  },
  render: (args) => <ConnectionExample {...args} />,
};
