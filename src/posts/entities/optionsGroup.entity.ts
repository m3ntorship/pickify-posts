// import { OneToMany } from 'typeorm';
import Model from '../../shared/entity.model';
import { Column, Entity } from 'typeorm';
// import { Option } from './option.entity';

@Entity('options_groups')
export class OptiosnGroup extends Model {
  // @OneToMany(() => Option, (option) => option.optiongroup)
  // options: Option[];
  @Column()
  name: string;
}
