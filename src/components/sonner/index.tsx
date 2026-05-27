import {
  CircleCheck,
  CircleX,
  TriangleAlert,
  BadgeInfo,
  Loader2,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ closeButton = true, ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group pointer-events-none"
      closeButton={closeButton}
      icons={{
        success: <CircleCheck className="size-4" />,
        error: <CircleX className="size-4" />,
        warning: <TriangleAlert className="size-4" />,
        info: <BadgeInfo className="size-4" />,
        loading: <Loader2 className="size-4 animate-spin" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group toast pointer-events-auto transition-all duration-300 shadow-none flex gap-1.5 relative",
          title: "text-sm leading-4",
          description: "text-xs md:text-sm opacity-60",
          closeButton:
            "absolute! -top-2.5! -right-2.5! left-auto! z-10! size-5! rounded-md! flex! items-center! justify-center! opacity-100! transition-[filter,border-color]! duration-150! cursor-pointer! border! border-current/10! border-border/70! bg-inherit! text-inherit! backdrop-blur-xl filter hover:contrast-125! hover:brightness-95! dark:hover:brightness-110! p-0! [&_svg]:size-2.5! [&_svg]:stroke-[2.5]! [&_svg]:text-inherit!",
          error:
            "text-status-foreground-error bg-status-background-error backdrop-blur-sm border-status-foreground-error/10 border p-2.5 rounded-md shadow border border-border",
          success:
            "text-status-foreground-success bg-status-background-success backdrop-blur-sm border-status-foreground-success/10 border p-2.5 rounded-md shadow border border-border",
          warning:
            "text-status-foreground-warning bg-status-background-warning backdrop-blur-sm border-status-foreground-warning/10 border p-2.5 rounded-md shadow border border-border",
          info: "text-status-foreground-info bg-status-background-info backdrop-blur-lg border-status-foreground-info/10 border p-2.5 rounded-md shadow border border-border",
          loading:
            "text-status-foreground-loading bg-status-background-loading text-base backdrop-blur-sm border-status-foreground-loading/10 border p-2.5 rounded-md shadow border border-border",
          loader: " text-stone-50 absolute! left-[13px]! top-[13px]!",
          icon: "self-center flex shrink-0 size-4 [[data-sonner-toast]:has([data-description])_&]:self-start [[data-sonner-toast]:has([data-description])_&]:mt-0.5",
          actionButton: "bg-white text-black font-medium rounded-md px-2 py-1",
          cancelButton:
            "shrink-0 rounded-md border border-current/10 border-border bg-inherit px-2 py-1 text-inherit font-medium filter transition-[filter,border-color] duration-150 hover:contrast-125 hover:brightness-95 dark:hover:brightness-110 [&_svg]:text-inherit [&_svg]:size-3.5",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
