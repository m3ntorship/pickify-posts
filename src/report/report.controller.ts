import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ExtendedRequest } from '../shared/interfaces/expressRequest';
import { CreatePostsReportDTO } from './dto/createReport.dto';
import { AdminAuthGuard } from '../shared/Guards/admin.guard';
// import { ReportedPosts } from './interfaces/getPostsReports.interface';
import { ReportService } from './report.service';
import { Post as postEntity } from 'src/posts/entities/post.entity';
import { ReportedPosts } from './interfaces/getPostsReports.interface';

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
  async getPostsReports(): Promise<ReportedPosts> {
    return await this.reportService.getAllPostsReports();
  }
}
