export interface HotTag {
  label: string;
  tagged_count: number;
  taggers_count: number;
  taggers_id: string[];
}

export interface Tag {
  tag_id: string;
  indexed_at: number;
  tagger_id: string;
}

export interface TagsByReach {
  tags: HotTag[];
}

export interface Taggers {
  taggers: string[];
}
