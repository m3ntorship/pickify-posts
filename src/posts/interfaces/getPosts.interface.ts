export interface post {
  id: string;
  caption: string;
  is_hidden: boolean;
  created_at: Date;
  type: string;
  options_groups: optionsGroup;
}
export interface optionsGroup {
  groups: group[];
}
export interface option {
  id: string;
  body: string;
  vote_count: number;
}
export interface group {
  id: string;
  name: string;
  options: option[];
}
export interface posts {
  postsCount: number;
  posts: post[];
}
