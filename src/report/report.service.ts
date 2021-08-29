import { Injectable } from '@nestjs/common';
import { PostRepository } from '../posts/entities/post.repository';
import { User } from '../users/entities/user.entity';
import { CreatePostsReportDTO } from './dto/createReport.dto';
import { PostsReportRepository } from './entities/report.repository';
import { PostsReports } from './interfaces/getPostsReports.interface';

@Injectable()
export class ReportService {
  constructor(
    private postsReportRepository: PostsReportRepository,
    private postRepository: PostRepository,
  ) {}

  async createPostsReport(
    createPostsReportDTO: CreatePostsReportDTO,
    reporter: User,
  ): Promise<void> {
    const post = await this.postRepository.findOne({
      uuid: createPostsReportDTO.postId,
    });
    await this.postsReportRepository.createPostsReport(post, reporter);
  }

  async getAllPostsReports(): Promise<PostsReports> {
    const reports = await this.postsReportRepository.getAllPostsReports();
    return {
      postsReportsCount: reports.length,
      postsReports: reports,
    };
  }
}
