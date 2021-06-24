// import { OneToMany } from 'typeorm';
import Model, { POSTS_SCHEMA } from '../../shared/entity.model';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Option } from './option.entity';
import { Post } from './post.entity';

@Entity({ name: 'options_groups', schema: POSTS_SCHEMA })
export class OptiosnGroup extends Model {
  @Column()
  name: string;

  // one to many relation with option entity
  @OneToMany(() => Option, (option) => option.optionsGroup)
  options: Option[];

  // many to one relation with post entity
  @ManyToOne(() => Post, (post) => post.groups, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
