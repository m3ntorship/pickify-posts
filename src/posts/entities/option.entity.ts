import Model from '../../shared/entity.model';
import { Column, Entity, ManyToOne } from 'typeorm';
import { OptiosnGroup } from './optionsGroup.entity';

@Entity({ name: 'options', schema: 'pickify_posts' })
export class Option extends Model {
  @Column()
  body: string;

  @Column()
  vote_count: number;

  @ManyToOne(() => OptiosnGroup, (optionsGroup) => optionsGroup.options)
  optionsGroup: OptiosnGroup;
}
