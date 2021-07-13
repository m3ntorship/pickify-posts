import Model, { POSTS_SCHEMA } from '../../shared/entity.model';
import { Column, Entity, OneToMany } from 'typeorm';
import { Post } from './post.entity';
import { Vote } from '../../votes/entities/vote.entity';

@Entity({ name: 'users', schema: POSTS_SCHEMA })
export class User extends Model {
  @Column()
  name: string;

  @Column()
  profile_pic: string;

  // one to many relation with posts entity
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  // one to many relation with votes entity
  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];
}
