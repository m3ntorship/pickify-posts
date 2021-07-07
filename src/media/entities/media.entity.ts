import { Option } from '../../posts/entities/option.entity';
import { OptiosnGroup } from '../../posts/entities/optionsGroup.entity';
import { Post } from '../../posts/entities/post.entity';
import Model, { POSTS_SCHEMA } from '../../shared/entity.model';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'media', schema: POSTS_SCHEMA })
export class Media extends Model {
  @Column()
  url: string;

  // many-to-one relation with post entity
  @ManyToOne(() => Post, (post) => post.media, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  // many-to-one relation with optionGroup entity
  @ManyToOne(() => OptiosnGroup, (optionsGroup) => optionsGroup.media, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'options_group_id' })
  optionsGroup: OptiosnGroup;

  // many-to-one relation with option entity
  @ManyToOne(() => Option, (option) => option.media, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'option_id' })
  option: Option;
}
