import { cn } from "@/utilities";

interface Props {
  title: string;
  description: string;
  color?: "rose" | "white";
  appearance?: "card" | "plain";
  icon?: React.ElementType;
  size?: "sm" | "md";
  classNameCard?: string;
  classNameIconCard?: string;
  classNameTitle?: string;
  classNameDescription?: string;
}
const colorVariants = {
  rose: {
    border: "border-status-card-border-error",
    background: "bg-status-card-background-error",
    backgroundCardIcon: "bg-status-card-background-icon-error",
    textPrimary: "text-status-card-foreground-error",
    textSecondary: "text-status-card-foreground-error opacity-60",
  },
  white: {
    border: "border-status-card-border-empty",
    background: "bg-status-card-background-empty",
    backgroundCardIcon: "bg-status-card-background-icon-empty",
    textPrimary: "text-status-card-foreground-empty",
    textSecondary: "text-status-card-foreground-empty opacity-60",
  },
};

export const StatusMessage: React.FC<Props> = ({
  title,
  description,
  color = "rose",
  appearance = "card",
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
        "flex items-center flex-wrap",
        size === "sm" ? "gap-2" : "gap-4",
        appearance === "card" && "rounded-md border",
        appearance === "card" && (size === "sm" ? "p-4" : "p-6"),
        classNameCard,
        appearance === "card" && colorVariants[color].background,
        appearance === "card" && colorVariants[color].border
      )}
    >
      {Icon && (
        <div
          className={cn(
            "flex items-center justify-center rounded-md",
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
