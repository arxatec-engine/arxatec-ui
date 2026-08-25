import { FileViewErrorState } from "../error_state";
import { FileAudioPlayerContent } from "./components/file_audio_player_content";
import type { FileAudioPlayerProps } from "./types";

export const FileAudioPlayer = (props: FileAudioPlayerProps) => {
  if (!props.url) return <FileViewErrorState />;

  return <FileAudioPlayerContent key={props.url} {...props} />;
};

export type { FileAudioPlayerProps } from "./types";
