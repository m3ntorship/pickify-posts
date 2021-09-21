import { Post } from 'src/posts/interfaces/getPosts.interface';

export interface User {
  id: string;
  name: string;
  profile_pic: string;
}
export interface UserPosts {
  postsCount: number;
  user: User;
  posts: Post[];
}
