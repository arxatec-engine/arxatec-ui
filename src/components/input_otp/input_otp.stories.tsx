import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import { classNameControl } from "@/utilities/storybook";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./index";

type InputOTPStoryArgs = Pick<
  ComponentProps<typeof InputOTP>,
  "className" | "containerClassName" | "maxLength" | "disabled"
>;

const meta = {
  title: "Components/InputOTP",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    ...classNameControl,
    maxLength: { control: { type: "number", min: 4, max: 8 } },
    disabled: { control: "boolean" },
  },
} satisfies Meta<InputOTPStoryArgs>;

export default meta;

type Story = StoryObj<InputOTPStoryArgs>;

export const Default: Story = {
  args: { maxLength: 6, disabled: false },
  render: ({
    maxLength = 6,
    disabled,
    className,
    containerClassName,
  }) => (
    <InputOTP
      maxLength={maxLength}
      disabled={disabled}
      className={className}
      containerClassName={containerClassName}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
};
