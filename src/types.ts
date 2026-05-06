export interface Image {
  file_name: string;
  file_path: string;
  file_size: number;
  last_modified: { secs_since_epoch: number; nanos_since_epoch: number };
}

export interface EncodeMutation {
  path: string;
  message: string;
  save_name: string;
}

export type ImagesSort =
  | "newest"
  | "oldest"
  | "alpha"
  | "de_alpha"
  | "small"
  | "large";

export interface ImagesState {
  files: Image[];
  sort: ImagesSort;
  search: string;
  selected: Image | null;
}
