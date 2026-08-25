import { cva } from "class-variance-authority";

const dropdownMenuItemVariants = cva(
  "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center rounded-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        default:
          "gap-2 px-2 py-1.5 text-sm [&_svg:not([class*='size-'])]:size-4",
        sm: "gap-1.5 px-1.5 py-1 text-sm [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export { dropdownMenuItemVariants };
