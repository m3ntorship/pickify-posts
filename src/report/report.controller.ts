import { Body, Controller, HttpCode, Post, Request } from '@nestjs/common';
import { ExtendedRequest } from '../shared/interfaces/expressRequest';
import { CreatePostsReportDTO } from './dto/createReport.dto';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post('/')
  @HttpCode(204)
  async createPostsReport(
    @Request() req: ExtendedRequest,
    @Body() createPostsReportDTO: CreatePostsReportDTO,
  ): Promise<void> {
    await this.reportService.createPostsReport(createPostsReportDTO, req.user);
  }
}
