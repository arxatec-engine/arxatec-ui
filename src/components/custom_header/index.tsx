import { Button } from "../button";

interface Props {
  title: string;
  description?: string;
  button?: {
    label: string;
    url: string;
    icon: React.ElementType;
  };
}

export const CustomHeader: React.FC<Props> = ({
  title,
  description,
  button,
}) => {
  return (
    <div className="flex items-center justify-between mb-4 sm:flex-nowrap flex-wrap gap-4">
      <div>
        <h1 className="text-lg font-normal">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground max-w-xl mt-1">
            {description}
          </p>
        )}
      </div>
      {button && (
        <Button size="sm" className="sm:w-fit w-full">
          <button.icon className="size-4" />
          {button.label}
        </Button>
      )}
    </div>
  );
};
