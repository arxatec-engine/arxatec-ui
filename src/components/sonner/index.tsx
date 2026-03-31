import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group toast transition-all duration-300 shadow-none flex gap-1.5",
          title: "text-sm leading-5",
          description: "text-xs md:text-sm opacity-60",
          error:
            "text-status-foreground-error bg-status-background-error backdrop-blur-sm border-status-foreground-error/10 border p-2.5 rounded-md shadow border border-border",
          success:
            "text-status-foreground-success bg-status-background-success backdrop-blur-sm border-status-foreground-success/10 border p-2.5 rounded-md shadow border border-border",
          warning:
            "text-status-foreground-warning bg-status-background-warning backdrop-blur-sm border-status-foreground-warning/10 border p-2.5 rounded-md shadow border border-border",
          info: "text-status-foreground-info bg-status-background-info backdrop-blur-lg border-status-foreground-info/10 border p-2.5 rounded-md shadow border border-border",
          loading:
            "text-status-foreground-loading bg-status-background-loading text-base backdrop-blur-sm border-status-foreground-loading/10 border p-2.5 rounded-md shadow border border-border",
          loader: " text-stone-50 absolute! left-2! top-[12px]!",
          icon: "text-sm  self-start flex h-full size-4",
          actionButton: "bg-white text-black font-medium rounded-md px-2 py-1",
          cancelButton: "bg-transparent text-white underline",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
