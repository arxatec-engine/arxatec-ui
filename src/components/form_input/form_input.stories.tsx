import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { useForm, type Path } from "react-hook-form";

import { classNameControl } from "@/utilities/storybook";
import { FormInput } from "./index";

type StoryForm = {
  title: string;
};

type FormInputStoryProps = {
  label?: string;
  name: Path<StoryForm>;
  type?: string;
  placeholder?: string;
  className?: string;
  optional?: boolean;
  disabled?: boolean;
  size?: "default" | "sm";
};

function FormInputStory(args: FormInputStoryProps) {
  const { register, formState } = useForm<StoryForm>({
    defaultValues: { title: "" },
  });
  return (
    <FormInput {...args} register={register} errors={formState.errors} />
  );
}

function FormInputWithErrorStory(args: FormInputStoryProps) {
  const { register, formState, setError, clearErrors } = useForm<StoryForm>({
    defaultValues: { title: "" },
  });

  useEffect(() => {
    setError("title", { message: "Este campo es obligatorio" });
    return () => clearErrors("title");
  }, [setError, clearErrors]);

  return (
    <FormInput {...args} register={register} errors={formState.errors} />
  );
}

const meta = {
  title: "Components/FormInput",
  component: FormInputStory,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    ...classNameControl,
    name: { control: false },
    label: { control: "text" },
    placeholder: { control: "text" },
    optional: { control: "boolean" },
    disabled: { control: "boolean" },
    size: { control: "select", options: ["default", "sm"] },
    type: {
      control: "select",
      options: ["text", "password", "email", "search", "number", "tel", "url"],
    },
  },
} satisfies Meta<FormInputStoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "title",
    label: "Título",
    placeholder: "Escribe el título…",
    optional: false,
    disabled: false,
    size: "default",
    type: "text",
  },
  render: (args) => <FormInputStory {...args} />,
};

export const Opcional: Story = {
  args: {
    ...Default.args,
    optional: true,
    label: "Subtítulo",
    placeholder: "Opcional",
  },
  render: (args) => <FormInputStory {...args} />,
};

export const Pequeño: Story = {
  args: {
    ...Default.args,
    size: "sm",
    placeholder: "Tamaño sm",
  },
  render: (args) => <FormInputStory {...args} />,
};

export const ConError: Story = {
  args: {
    ...Default.args,
    label: "Campo con error",
  },
  render: (args) => <FormInputWithErrorStory {...args} />,
};

export const Deshabilitado: Story = {
  args: {
    ...Default.args,
    disabled: true,
    placeholder: "No editable",
  },
  render: (args) => <FormInputStory {...args} />,
};
