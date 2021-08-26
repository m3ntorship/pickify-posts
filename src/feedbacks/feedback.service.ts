import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { FeedbackCreationDto } from './dto/feedback.dto';
import { Feedback } from './entities/feedback.entity';
import { FeedbackRepository } from './entities/feedback.repository';
import { Feedbacks } from './interfaces/getFeedbacks.interface';
import { Feedback as Ifeedback } from './interfaces/getFeedbacks.interface';
@Injectable()
export class FeedBackService {
  constructor(private feebackRepository: FeedbackRepository) {}

  private handleFeedbacks(feedback: Feedback): Ifeedback {
    // modifying feedback to be as in the interface
    const modifiedFeedback = {
      feedback_body: feedback.feedback_body,
      feedback_rating: feedback.feedback_rating,
      user: {
        id: feedback.user.uuid,
        name: feedback.user.name,
        profile_pic: feedback.user.profile_pic,
      },
    };
    return modifiedFeedback;
  }

  async createFeedback(
    feedbackCreationDto: FeedbackCreationDto,
    user: User,
  ): Promise<void> {
    const createdFeedback = await this.feebackRepository.createFeedback(
      feedbackCreationDto,
      user,
    );
  }

  async getAllFeedBacks(): Promise<Feedbacks> {
    const currentFeedbacks = await this.feebackRepository.getAllFeedBacks();

    const modifiedFeedbacks = currentFeedbacks.map((feedback) => {
      return this.handleFeedbacks(feedback);
    });

    return {
      feedbacksCount: currentFeedbacks.length,
      feedbacks: modifiedFeedbacks,
    };
  }
}
