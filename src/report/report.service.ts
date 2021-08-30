import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/entities/user.repository';
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
    private userRepositoy: UserRepository,
  ) {}

  async createPostsReport(
    createPostsReportDTO: CreatePostsReportDTO,
    reporter: User,
  ): Promise<void> {
    const post = await this.postRepository.findOne({
      uuid: createPostsReportDTO.postId,
    });
    //reporter is allowed to report 50 posts only per day
    if (reporter.dailyReportsCount <= 50) {
      await this.postsReportRepository
        .createPostsReport(post, reporter)
        //if reporter is tring to report the same post twoice throw an error
        .catch(() => {
          throw new HttpException(
            {
              message: "Reporter cann't report same post twoice",
            },
            HttpStatus.CONFLICT,
          );
        });
      reporter.dailyReportsCount++;
      await this.userRepositoy.save(reporter);
      //throw an error if the daily report count is exceeded
    } else {
      throw new HttpException(
        {
          message: 'Reporter can only report 50 posts per day',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  async getAllPostsReports(): Promise<PostsReports> {
    const reports = await this.postsReportRepository.getAllPostsReports();
    const posts = await this.postRepository.find({});
    const allPostsReports = [];
    for (let i = 0; i < posts.length; i++) {
      allPostsReports[i] = {
        post: posts[i],
        postReports: await this.postsReportRepository.find({ post: posts[i] }),
      };
    }
    return {
      postsReportsCount: reports.length,
      reports: allPostsReports,
    };
  }
}
