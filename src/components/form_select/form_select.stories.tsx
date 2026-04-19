import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useForm, type Control, type FieldValues } from "react-hook-form";

import { classNameControl } from "@/utilities/storybook";
import { FormSelect } from "./index";

type StoryForm = {
  country: string;
};

const COUNTRY_OPTIONS = [
  { value: "mx", label: "México" },
  { value: "es", label: "España" },
  { value: "ar", label: "Argentina" },
];

type FormSelectStoryProps = {
  name: keyof StoryForm & string;
  label?: string;
  optional?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  size?: "default" | "sm";
  renderItem?: (option: { value: string; label: string }) => ReactNode;
};

function FormSelectStory(args: FormSelectStoryProps) {
  const { control, formState } = useForm<StoryForm>({
    defaultValues: { country: "" },
  });
  return (
    <FormSelect
      {...args}
      control={control as unknown as Control<FieldValues>}
      errors={formState.errors}
    />
  );
}

function FormSelectWithErrorStory(args: FormSelectStoryProps) {
  const { control, formState, setError, clearErrors } = useForm<StoryForm>({
    defaultValues: { country: "" },
  });

  useEffect(() => {
    setError("country", { message: "Selecciona un país" });
    return () => clearErrors("country");
  }, [setError, clearErrors]);

  return (
    <FormSelect
      {...args}
      control={control as unknown as Control<FieldValues>}
      errors={formState.errors}
    />
  );
}

const meta = {
  title: "Components/FormSelect",
  component: FormSelectStory,
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
    options: { control: "object" },
    label: { control: "text" },
    optional: { control: "boolean" },
    placeholder: { control: "text" },
    size: { control: "select", options: ["default", "sm"] },
    renderItem: { table: { disable: true } },
  },
} satisfies Meta<FormSelectStoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "country",
    label: "País",
    options: COUNTRY_OPTIONS,
    placeholder: "Selecciona una opción",
    size: "default",
  },
  render: (args) => <FormSelectStory {...args} />,
};

export const ConValorPorDefecto: Story = {
  args: {
    ...Default.args,
    label: "País (con selección inicial)",
  },
  render: (args) => {
    function WithDefault() {
      const { control, formState } = useForm<StoryForm>({
        defaultValues: { country: "mx" },
      });
      return (
        <FormSelect
          {...args}
          control={control as unknown as Control<FieldValues>}
          errors={formState.errors}
        />
      );
    }
    return <WithDefault />;
  },
};

export const Pequeño: Story = {
  args: {
    ...Default.args,
    size: "sm",
    placeholder: "Tamaño sm",
  },
  render: (args) => <FormSelectStory {...args} />,
};

export const ConError: Story = {
  args: {
    ...Default.args,
    label: "Campo con error",
  },
  render: (args) => <FormSelectWithErrorStory {...args} />,
};

export const ItemPersonalizado: Story = {
  args: {
    ...Default.args,
    label: "Código · nombre",
  },
  render: (args) => (
    <FormSelectStory
      {...args}
      renderItem={(option) => (
        <span className="font-mono text-xs">{option.value}</span>
      )}
    />
  ),
};
