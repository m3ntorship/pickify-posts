import { Post } from '../../posts/entities/post.entity';
import Model, { POSTS_SCHEMA } from '../../shared/entity.model';
import { User } from '../../users/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'postsReports', schema: POSTS_SCHEMA })
export class PostsReport extends Model {
  @ManyToOne(() => User, (user) => user.postsReports)
  reporter: User;

  @ManyToOne(() => Post, (post) => post.postsReports)
  post: Post;
}
