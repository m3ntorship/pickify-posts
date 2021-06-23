export interface Post {
  id: string;
  caption: string;
  is_hidden: boolean;
  created_at: Date;
  type: string;
  user: User;
  options_groups: OptionsGroup;
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
}
export interface Group {
  id: string;
  name: string;
  options: Option[];
}
export interface Posts {
  postsCount: number;
  posts: Post[];
}
