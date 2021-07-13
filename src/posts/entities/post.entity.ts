import { Media } from '../../media/entities/media.entity';
import { Entity, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';

import Model, { POSTS_SCHEMA } from '../../shared/entity.model';
import { OptiosnGroup } from './optionsGroup.entity';
import { User } from './user.entity';

@Entity({ name: 'posts', schema: POSTS_SCHEMA })
export class Post extends Model {
  @Column({ nullable: true })
  caption: string;

  @Column()
  type: string;

  @Column()
  is_hidden: boolean;

  @Column()
  ready: boolean;

  @Column()
  created: boolean;

  @Column({ default: 0 })
  media_count: number;

  // one to many relation with options_group entity
  @OneToMany(() => OptiosnGroup, (group) => group.post)
  groups: OptiosnGroup[];

  // one to many relation with media entity
  @OneToMany(() => Media, (media) => media.post)
  media: Media[];

  // many to one relation with user entity
  @ManyToOne(() => User, (user) => user.posts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
