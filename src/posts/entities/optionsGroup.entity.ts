// import { OneToMany } from 'typeorm';
import Model from '../../shared/entity.model';
import { Column, Entity, OneToMany } from 'typeorm';
import { Option } from './option.entity';

@Entity('options_groups')
export class OptiosnGroup extends Model {
  @Column()
  name: string;

  @OneToMany(() => Option, (option) => option.optionsGroup, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  options: Option[];
}
