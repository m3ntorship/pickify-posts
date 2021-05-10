import { Entity, Column } from 'typeorm';

import Model from '../../shared/entity.model';

@Entity('posts')
export class Post extends Model {
  @Column()
  caption: string;

  @Column()
  type: string;

  @Column()
  isHidden: string;

  @Column()
  user_id: number;

  @Column()
  ready: boolean;

  @Column()
  created: boolean;
}
