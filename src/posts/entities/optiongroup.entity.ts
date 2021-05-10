import { OneToMany } from 'typeorm';
import Model from 'src/shared/entity.model';
import { Option } from './option.entity';

export class OptionGroup extends Model {
  @OneToMany(() => Option, (option) => option.optiongroup)
  options: Option[];
}
