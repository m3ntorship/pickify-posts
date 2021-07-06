export interface Post {
  id: string;
  caption: string;
  is_hidden: boolean;
  created_at: Date;
  type: string;
  user: User;
  media?: Media[];
  options_groups: OptionsGroup;
}

export interface Media {
  url: string;
}

export interface User {
  id: string;
  name: string;
  profile_pic: string;
}
export interface OptionsGroup {
  groups: Group[];
}
export interface Option {
  id: string;
  body: string;
  vote_count: number;
  media?: Media[];
}
export interface Group {
  id: string;
  name: string;
  options: Option[];
  media?: Media[];
}
export interface Posts {
  postsCount: number;
  posts: Post[];
}
