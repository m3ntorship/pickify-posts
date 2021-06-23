import Model, { POSTS_SCHEMA } from '../../shared/entity.model';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { OptiosnGroup } from './optionsGroup.entity';
import { Vote } from '../../votes/entities/vote.entity';
import { Media } from '../../media/entities/media.entity';

@Entity({ name: 'options', schema: POSTS_SCHEMA })
export class Option extends Model {
  @Column()
  body: string;

  @Column()
  vote_count: number;

  // many-to-one relation with OptionGroup entity
  @ManyToOne(() => OptiosnGroup, (optionsGroup) => optionsGroup.options, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  optionsGroup: OptiosnGroup;

  // one-to-many relation with Vote entity
  @OneToMany(() => Vote, (vote) => vote.option)
  votes: Vote[];

  // one-to-many relation with Media entity
  @OneToMany(() => Media, (media) => media.option)
  media: Media[];
}
