// import { OneToMany } from 'typeorm';
import Model from '../../shared/entity.model';
import { Column, Entity, OneToMany } from 'typeorm';
import { Option } from './option.entity';

@Entity({ name: 'options_groups', schema: 'pickify_posts' })
export class OptiosnGroup extends Model {
  @Column()
  name: string;

  @OneToMany(() => Option, (option) => option.optionsGroup)
  options: Option[];
}
