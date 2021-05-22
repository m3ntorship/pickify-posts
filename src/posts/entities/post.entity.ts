import { Entity, Column } from 'typeorm';

import Model from '../../shared/entity.model';

@Entity('posts')
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
