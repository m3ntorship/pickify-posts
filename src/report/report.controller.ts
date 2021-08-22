import { Body, Controller, Get, HttpCode, Post, Request } from '@nestjs/common';
import { ExtendedRequest } from '../shared/interfaces/expressRequest';
import { FeedbackCreationDto } from './dto/feedback.dto';
import { Feedback } from './entities/feedback.entity';
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
    return await this.reportService.createFeedback(feedbackDto, req.user);
  }
  @Get('/feedback')
  @HttpCode(200)
  async getFeedbacks(): Promise<Feedback[]> {
    return await this.reportService.getFeedBacks();
  }
}
