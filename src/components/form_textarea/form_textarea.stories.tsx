import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { useForm, type Path } from "react-hook-form";

import { classNameControl } from "@/utilities/storybook";
import { FormTextarea } from "./index";

type StoryForm = {
  notes: string;
};

type FormTextareaStoryProps = {
  label?: string;
  name: Path<StoryForm>;
  placeholder?: string;
  className?: string;
  optional?: boolean;
  autoFocus?: boolean;
  rows?: number;
  disabled?: boolean;
};

function FormTextareaStory(args: FormTextareaStoryProps) {
  const { register, formState } = useForm<StoryForm>({
    defaultValues: { notes: "" },
  });
  return (
    <FormTextarea {...args} register={register} errors={formState.errors} />
  );
}

function FormTextareaWithErrorStory(args: FormTextareaStoryProps) {
  const { register, formState, setError, clearErrors } = useForm<StoryForm>({
    defaultValues: { notes: "" },
  });

  useEffect(() => {
    setError("notes", { message: "Añade al menos un comentario" });
    return () => clearErrors("notes");
  }, [setError, clearErrors]);

  return (
    <FormTextarea {...args} register={register} errors={formState.errors} />
  );
}

const meta = {
  title: "Components/FormTextarea",
  component: FormTextareaStory,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-80">
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
    autoFocus: { control: "boolean" },
    rows: { control: "number" },
  },
} satisfies Meta<FormTextareaStoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "notes",
    label: "Notas",
    placeholder: "Escribe un comentario…",
    rows: 4,
    optional: false,
    disabled: false,
    autoFocus: false,
  },
  render: (args) => <FormTextareaStory {...args} />,
};

export const Opcional: Story = {
  args: {
    ...Default.args,
    optional: true,
    label: "Observaciones",
    placeholder: "Opcional",
  },
  render: (args) => <FormTextareaStory {...args} />,
};

export const ConError: Story = {
  args: {
    ...Default.args,
    label: "Comentario",
  },
  render: (args) => <FormTextareaWithErrorStory {...args} />,
};

export const Deshabilitado: Story = {
  args: {
    ...Default.args,
    disabled: true,
    placeholder: "No editable",
  },
  render: (args) => <FormTextareaStory {...args} />,
};
