import { Entity, Column } from 'typeorm';

import Model from '../../shared/entity.model';

@Entity()
export class Post extends Model {
  @Column()
  caption: string;

  @Column()
  type: string;

  @Column()
  is_hidden: string;

  @Column()
  user_id: number;

  @Column()
  ready: boolean;

  @Column()
  created: boolean;
}
