import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import Model, { POSTS_SCHEMA } from '../../shared/entity.model';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'feedbacks', schema: POSTS_SCHEMA })
export class Feedback extends Model {
  @Column({ nullable: true })
  @Column()
  feedback_body: string;

  @Column()
  feedback_choice: number;

  @ManyToOne(() => User, (user) => user.feedbacks, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'google_id' })
  user: User;
}
