import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ExtendedRequest } from '../shared/interfaces/expressRequest';
import { CreatePostsReportDTO } from './dto/createReport.dto';
import { AdminAuthGuard } from './guards/admin.guard';
import { PostsReports } from './interfaces/getPostsReports.interface';
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

  @Get('/')
  @UseGuards(AdminAuthGuard)
  async getPostsReports(): Promise<PostsReports> {
    return await this.reportService.getAllPostsReports();
  }
}
