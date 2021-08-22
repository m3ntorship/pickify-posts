import { User } from '../../users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { FeedbackCreationDto } from '../dto/feedback.dto';
import { Feedback } from './feedback.entity';

@EntityRepository(Feedback)
export class FeedbackRepository extends Repository<Feedback> {
  async createFeedback(
    feedbackDto: FeedbackCreationDto,
    user: User,
  ): Promise<Feedback> {
    const { feedback_body, feedback_choice } = feedbackDto;
    const feedback = this.create();
    feedback.feedback_choice = feedback_choice;
    feedback.feedback_body = feedback_body;
    feedback.user = user;
    return await this.save(feedback);
  }
  async getAllFeedBacks(): Promise<Feedback[]> {
    return await this.createQueryBuilder('feedback')
      .select([
        'feedback.feedback_body',
        'feedback.feedback_choice',
        'user.uuid',
      ])
      .leftJoin('feedback.user', 'user')
      .getMany();
  }
}
