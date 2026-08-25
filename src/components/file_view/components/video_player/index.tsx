import {
          ErrorState
} from "./components";
import { FileVideoPlayerContent } from "./components/file_video_player_content";
import type { FileVideoPlayerProps } from "./types";

export const FileVideoPlayer = (props: FileVideoPlayerProps) => {
  if (!props.url) {
    return (
      <div className="flex flex-col h-full w-full bg-background">
        <div className="flex-1 flex items-center justify-center">
          <ErrorState />
        </div>
      </div>
    );
  }

  return <FileVideoPlayerContent key={props.url} {...props} />;
};

export type { FileVideoPlayerProps } from "./types";
