import { cn } from "@/utilities/class";

import { ErrorState } from "./components/error_state";
import { FileVideoPlayerContent } from "./components/file_video_player_content";
import type { FileVideoPlayerProps } from "./types";

export const FileVideoPlayer = (props: FileVideoPlayerProps) => {
  if (!props.url) {
    return (
      <div
        data-slot="file-video-player"
        className={cn(
          "flex h-full w-full flex-col bg-background",
          props.className,
        )}
      >
        <div className="flex-1 flex items-center justify-center">
          <ErrorState
            labels={props.labels}
            onLoadingChange={props.onLoadingChange}
          />
        </div>
      </div>
    );
  }

  return <FileVideoPlayerContent key={props.url} {...props} />;
};

export type { FileVideoPlayerProps, FileVideoPlayerLabels } from "./types";
