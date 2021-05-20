import Model from '../../shared/entity.model';
import { Column, Entity } from 'typeorm';

@Entity('options')
export class Option extends Model {
  @Column()
  body: string;

  @Column()
  vote_count: number;
}
