import Model, { POSTS_SCHEMA } from '../../shared/entity.model';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OptiosnGroup } from './optionsGroup.entity';
import { Vote } from '../../votes/entities/vote.entity';

@Entity({ name: 'options', schema: POSTS_SCHEMA })
export class Option extends Model {
  @Column()
  body: string;

  @Column()
  vote_count: number;

  @ManyToOne(() => OptiosnGroup, (optionsGroup) => optionsGroup.options, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'options_group_id' })
  optionsGroup: OptiosnGroup;

  @OneToMany(() => Vote, (vote) => vote.option)
  votes: Vote[];
}
