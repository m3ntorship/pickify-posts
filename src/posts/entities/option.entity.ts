import Model, { POSTS_SCHEMA } from '../../shared/entity.model';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { OptiosnGroup } from './optionsGroup.entity';
import { Vote } from './vote.entity';

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
  optionsGroup: OptiosnGroup;

  @OneToMany(() => Vote, (vote) => vote.option)
  votes: Vote[];
}
