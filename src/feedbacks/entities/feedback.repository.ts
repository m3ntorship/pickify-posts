import { User } from '../../users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { FeedbackCreationDto } from '../dto/feedback.dto';
import { Feedback } from './feedback.entity';

@EntityRepository(Feedback)
export class FeedbackRepository extends Repository<Feedback> {
  async createFeedback(
    feedbackDto: FeedbackCreationDto,
    user: User,
  ): Promise<void> {
    const { feedback_body, feedback_rating } = feedbackDto;
    const feedback = this.create();
    feedback.feedback_rating = feedback_rating;
    feedback.feedback_body = feedback_body;
    feedback.user = user;
    await this.save(feedback);
  }
  async getAllFeedBacks(): Promise<Feedback[]> {
    return await this.createQueryBuilder('feedback')
      .select(['feedback.feedback_body', 'feedback.feedback_rating', 'user'])
      .leftJoin('feedback.user', 'user')
      .orderBy({
        'feedback.created_at': 'DESC',
      })
      .getMany();
  }
}
