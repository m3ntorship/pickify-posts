import { Entity, Column } from 'typeorm';

import Model, { POSTS_SCHEMA } from '../../shared/entity.model';

@Entity({ name: 'posts', schema: POSTS_SCHEMA })
export class Post extends Model {
  @Column({ nullable: true })
  caption: string;

  @Column()
  type: string;

  @Column()
  is_hidden: boolean;

  @Column()
  user_id: number;

  @Column()
  ready: boolean;

  @Column()
  created: boolean;
}
