import Model, { POSTS_SCHEMA } from '../../shared/entity.model';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Option } from '../../posts/entities/option.entity';

@Entity({ name: 'votes', schema: POSTS_SCHEMA })
export class Vote extends Model {
  @ManyToOne(() => Option, (option) => option.votes, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  option: Option;

  @Column()
  user_id: number;
}
