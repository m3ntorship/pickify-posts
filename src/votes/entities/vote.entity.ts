import Model, { POSTS_SCHEMA } from '../../shared/entity.model';
import { Entity, ManyToOne } from 'typeorm';
import { Option } from '../../posts/entities/option.entity';

@Entity({ name: 'vote', schema: POSTS_SCHEMA })
export class Vote extends Model {
  @ManyToOne(() => Option, (option) => option.votes)
  option: Option;
}
