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
import { AdminAuthGuard } from '../shared/Guards/admin.guard';
import { ReportService } from './report.service';
import { ReportedPosts } from './interfaces/getPostsReports.interface';

@Controller('reports')
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
  async getPostsReports(): Promise<ReportedPosts> {
    return await this.reportService.getAllPostsReports();
  }
}
