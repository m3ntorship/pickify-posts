import { Post } from '../entities/post.entity';

export interface UserPostsInfo {
  totalPostsCount: number;
  posts: Post[];
}
