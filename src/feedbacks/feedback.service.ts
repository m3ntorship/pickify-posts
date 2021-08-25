import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { FeedbackCreationDto } from './dto/feedback.dto';
import { Feedback } from './entities/feedback.entity';
import { FeedbackRepository } from './entities/feedback.repository';

@Injectable()
export class FeedBackService {
  constructor(private feebackRepository: FeedbackRepository) {}
  async createFeedback(
    feedbackCreationDto: FeedbackCreationDto,
    user: User,
  ): Promise<void> {
    const createdFeedback = await this.feebackRepository.createFeedback(
      feedbackCreationDto,
      user,
    );
  }

  async getAllFeedBacks(): Promise<Feedback[]> {
    return await this.feebackRepository.getAllFeedBacks();
  }
}
