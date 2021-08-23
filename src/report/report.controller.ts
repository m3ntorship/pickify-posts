import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { auth } from 'firebase-admin';
import { ExtendedRequest } from '../shared/interfaces/expressRequest';
import { FeedbackCreationDto } from './dto/feedback.dto';
import { Feedback } from './entities/feedback.entity';
import { AdminAuthGuard } from './Guards/admin.guard';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post('/feedback')
  @HttpCode(204)
  async createFeedback(
    @Body() feedbackDto: FeedbackCreationDto,
    @Request() req: ExtendedRequest,
  ): Promise<void> {
    await this.reportService.createFeedback(feedbackDto, req.user);
  }
  @UseGuards(AdminAuthGuard)
  @Get('/feedback')
  @HttpCode(200)
  async getFeedbacks(): Promise<Feedback[]> {
    return await this.reportService.getFeedBacks();
  }
}
