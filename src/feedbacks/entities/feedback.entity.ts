import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import Model, { POSTS_SCHEMA } from '../../shared/entity.model';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'feedbacks', schema: POSTS_SCHEMA })
export class Feedback extends Model {
  @Column()
  feedback_body: string;

  @Column()
  feedback_rating: number;

  @ManyToOne(() => User, (user) => user.feedbacks)
  user: User;
}
