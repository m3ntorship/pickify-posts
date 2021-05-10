import Model from 'src/shared/entity.model';
import { Column, ManyToOne } from 'typeorm';
import { OptionGroup } from './optiongroup.entity';

export class Option extends Model {
  @Column()
  body: string;

  @Column()
  vote_count: number;

  @Column()
  group_id: number;

  @ManyToOne(() => OptionGroup, (optiongroup) => optiongroup.options)
  optiongroup: OptionGroup;
}
