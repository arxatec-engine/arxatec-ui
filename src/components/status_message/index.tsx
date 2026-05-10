import { cn } from "@/utilities";

interface Props {
  title: string;
  description: string;
  color?: "rose" | "white";
  icon?: React.ElementType;
  size?: "sm" | "md";
  classNameCard?: string;
  classNameIconCard?: string;
  classNameTitle?: string;
  classNameDescription?: string;
}
const colorVariants = {
  rose: {
    background: "bg-status-card-background-error",
    backgroundCardIcon: "bg-status-card-background-icon-error",
    textPrimary: "text-status-card-foreground-error",
    textSecondary: "text-status-card-foreground-error opacity-60",
  },
  white: {
    background: "bg-status-card-background-empty",
    backgroundCardIcon: "bg-status-card-background-icon-empty",
    textPrimary: "text-status-card-foreground-empty",
    textSecondary: "text-status-card-foreground-emtpy opacity-60",
  },
};

export const StatusMessage: React.FC<Props> = ({
  title,
  description,
  color = "rose",
  icon: Icon,
  size = "md",
  classNameCard,
  classNameDescription,
  classNameIconCard,
  classNameTitle,
}) => {
  return (
    <div
      className={cn(
        " rounded-md flex items-center flex-wrap",
        size === "sm" ? "p-4 gap-2" : "p-6 gap-4",
        classNameCard,
        colorVariants[color].background
      )}
    >
      {Icon && (
        <div
          className={cn(
            "rounded-md flex items-center justify-center ",
            size === "sm" ? "size-8" : "size-12",
            classNameIconCard,
            colorVariants[color].backgroundCardIcon
          )}
        >
          <Icon
            className={cn(
              colorVariants[color].textPrimary,
              size === "sm" ? "size-4" : "size-6"
            )}
          />
        </div>
      )}

      <div className={cn("flex flex-col")}>
        <h2
          className={cn(
            "font-normal",
            size === "sm" ? "text-sm" : "text-base",
            colorVariants[color].textPrimary,
            classNameTitle
          )}
        >
          {title}
        </h2>
        <p
          className={cn(
            size === "sm" ? "text-sm" : "text-sm max-w-md",
            colorVariants[color].textSecondary,
            classNameDescription
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
};
