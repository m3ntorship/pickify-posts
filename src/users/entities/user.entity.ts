import Model, { POSTS_SCHEMA } from '../../shared/entity.model';
import { Column, Entity, OneToMany } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { Vote } from '../../votes/entities/vote.entity';
import { PostsReport } from '../../report/entities/postsReport.entity';

@Entity({ name: 'users', schema: POSTS_SCHEMA })
export class User extends Model {
  @Column()
  name: string;

  @Column()
  profile_pic: string;

  @Column({ default: '0' })
  google_id: string;

  @Column()
  dailyReportsCount: number;

  // one to many relation with posts entity
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  // one to many relation with votes entity
  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  // one to many relation with postsReport entity
  @OneToMany(() => PostsReport, (postsReport) => postsReport.reporter)
  postsReports: PostsReport[];
}
