import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import { classNameControl } from "@/utilities/storybook";
import { Avatar, AvatarFallback, AvatarImage } from "./index";

type AvatarStoryArgs = ComponentProps<typeof Avatar> & {
  src?: string;
  alt?: string;
  fallback?: string;
};

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    ...classNameControl,
    src: { control: "text", table: { category: "AvatarImage" } },
    alt: { control: "text", table: { category: "AvatarImage" } },
    fallback: { control: "text", description: "Texto del fallback" },
  },
} satisfies Meta<AvatarStoryArgs>;

export default meta;

type Story = StoryObj<AvatarStoryArgs>;

export const ConImagen: Story = {
  args: {
    src: "https://github.com/shadcn.png",
    alt: "Usuario",
    fallback: "CN",
  },
  render: ({ src, alt, fallback, ...root }) => (
    <Avatar {...root}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  args: {
    fallback: "AB",
    className: "",
  },
  argTypes: {
    src: { table: { disable: true } },
    alt: { table: { disable: true } },
  },
  render: ({ fallback, ...root }) => (
    <Avatar {...root}>
      <AvatarFallback className="text-xs font-medium">
        {fallback}
      </AvatarFallback>
    </Avatar>
  ),
};
