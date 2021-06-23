import Model, { POSTS_SCHEMA } from '../../shared/entity.model';
import { Entity, ManyToOne } from 'typeorm';
import { Option } from '../../posts/entities/option.entity';
import { User } from '../../posts/entities/user.entity';

@Entity({ name: 'votes', schema: POSTS_SCHEMA })
export class Vote extends Model {
  // many to one relation with option entity
  @ManyToOne(() => Option, (option) => option.votes, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  option: Option;

  // many to one relation with user entity
  @ManyToOne(() => User, (user) => user.votes, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
