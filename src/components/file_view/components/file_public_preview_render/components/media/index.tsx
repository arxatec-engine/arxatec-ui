import { cn } from "@/utilities/class";

interface Props {
  kind: "audio" | "video";
  url: string;
  fileName: string;
  className?: string;
}

export const PublicPreviewMedia = ({
  kind,
  url,
  fileName,
  className,
}: Props) => (
  <div
    data-slot="public-preview-media"
    className={cn(
      "flex h-full w-full items-center justify-center bg-background p-6",
      className,
    )}
  >
    {kind === "video" ? (
      <video
        src={url}
        aria-label={fileName}
        controls
        className="max-h-full max-w-full rounded-md"
      />
    ) : (
      <div className="w-full max-w-xl rounded-xl border border-border bg-card p-6">
        <p className="mb-4 truncate text-sm font-normal text-foreground">
          {fileName}
        </p>
        <audio src={url} aria-label={fileName} controls className="w-full" />
      </div>
    )}
  </div>
);
