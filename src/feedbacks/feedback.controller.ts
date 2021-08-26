import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { auth } from 'firebase-admin';
import { ExtendedRequest } from '../shared/interfaces/expressRequest';
import { FeedbackCreationDto } from './dto/feedback.dto';
import { Feedback } from './entities/feedback.entity';
import { AdminAuthGuard } from './Guards/admin.guard';
import { FeedBackService } from './feedback.service';
import { Feedbacks } from './interfaces/getFeedbacks.interface';

@Controller('feedbacks')
export class FeedBackController {
  constructor(private feedbackService: FeedBackService) {}

  @Post('/')
  @HttpCode(204)
  async createFeedback(
    @Body() feedbackDto: FeedbackCreationDto,
    @Request() req: ExtendedRequest,
  ): Promise<void> {
    await this.feedbackService.createFeedback(feedbackDto, req.user);
  }

  @Get('/')
  @UseGuards(AdminAuthGuard)
  @HttpCode(200)
  async getAllFeedbacks(): Promise<Feedbacks> {
    return await this.feedbackService.getAllFeedBacks();
  }
}
