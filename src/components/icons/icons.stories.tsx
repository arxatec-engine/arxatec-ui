import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  AppleIsotype,
  GoogleDriveIcon,
  GoogleIsotype,
  MicrosoftIsotype,
  OneDriveIcon,
} from "./index";

type IconsStoryArgs = {
  classNameIcono?: string;
};

const meta = {
  title: "Components/Icons",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    classNameIcono: {
      control: "text",
      description: "Clases aplicadas a cada icono",
    },
  },
} satisfies Meta<IconsStoryArgs>;

export default meta;

type Story = StoryObj<IconsStoryArgs>;

export const Marcas: Story = {
  args: {
    classNameIcono: "size-12 text-foreground",
  },
  render: ({ classNameIcono }) => (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <GoogleIsotype className={classNameIcono} />
      <MicrosoftIsotype className={classNameIcono} />
      <AppleIsotype className={classNameIcono} />
      <GoogleDriveIcon className={classNameIcono} />
      <OneDriveIcon className={classNameIcono} />
    </div>
  ),
};

export const AppleEnTemas: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="flex items-center gap-3 rounded-md bg-white p-4 text-black">
        <AppleIsotype className="size-6" aria-hidden="true" />
        <span>Apple en claro</span>
      </div>
      <div className="flex items-center gap-3 rounded-md bg-black p-4 text-white">
        <AppleIsotype className="size-6" aria-hidden="true" />
        <span>Apple en oscuro</span>
      </div>
    </div>
  ),
};
