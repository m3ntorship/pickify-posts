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
    await this.reportService
      .createPostsReport(createPostsReportDTO, req.user)
      .catch(() => {
        throw new HttpException(
          {
            message: "Reporter cann't report same post twoice",
          },
          HttpStatus.CONFLICT,
        );
      });
  }
  @Get('/')
  @UseGuards(AdminAuthGuard)
  async getPostsReports(): Promise<PostsReports> {
    return await this.reportService.getAllPostsReports();
  }
}
