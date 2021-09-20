import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post } from '../posts/entities/post.entity';
import { PostRepository } from '../posts/entities/post.repository';
import { User } from '../users/entities/user.entity';
import { CreatePostsReportDTO } from './dto/createReport.dto';
import { PostsReportRepository } from './entities/report.repository';
import { PostsReport } from './entities/postsReport.entity';
import {
  Report,
  ReportedPost,
  ReportedPosts,
} from './interfaces/getPostsReports.interface';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class ReportService {
  constructor(
    private postsReportRepository: PostsReportRepository,
    private postRepository: PostRepository,
    private postService: PostsService,
  ) {}

  private modifyReportedPost(reportedPost: Post): ReportedPost {
    const currentReports = reportedPost.postsReports;
    const modifiedReports = currentReports.map((report) => {
      return this.modifyReturnedReports(report);
    });
    const returnedPost = {
      post: {
        id: reportedPost.uuid,
        user: {
          id: reportedPost.user.uuid,
          name: reportedPost.user.name,
          profile_pic: reportedPost.user.profile_pic,
        },
        caption: reportedPost.caption,
        media: reportedPost.media,
        is_hidden: reportedPost.is_hidden,
        created_at: reportedPost.created_at,
        type: reportedPost.type,
        options_groups: {
          groups: this.postService.modifyGroupsData(reportedPost.groups),
        },
      },
      reports: modifiedReports,
    };
    return returnedPost;
  }
  private modifyReturnedReports(report: PostsReport): Report {
    const modifiedReport = {
      id: report.uuid,
      reporter: {
        id: report.reporter.uuid,
        name: report.reporter.name,
      },
    };
    return modifiedReport;
  }

  async createPostsReport(
    createPostsReportDTO: CreatePostsReportDTO,
    reporter: User,
  ): Promise<void> {
    const post = await this.postRepository.getDetailedPostById(
      createPostsReportDTO.postId,
    );

    if (!post) throw new NotFoundException('Post not found');

    //user can't report his own post
    if (post.user.uuid === reporter.uuid)
      throw new ForbiddenException('Cannot report your own post');

    //reporter is allowed to report 50 posts only per day
    const userReportsCount = await this.postsReportRepository.getUserReportsCount(
      reporter.uuid,
    );
    if (userReportsCount < 50) {
      await this.postsReportRepository
        .createPostsReport(post, reporter)
        //if reporter is tring to report the same post twoice throw an error
        .catch(() => {
          throw new HttpException(
            {
              message: "Reporter can't report same post twice",
            },
            HttpStatus.CONFLICT,
          );
        });
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

  async getAllPostsReports(): Promise<ReportedPosts> {
    const currentReportedPosts = await this.postRepository.getPostsReports();
    const modifiedReportedPosts = currentReportedPosts.map((reportedPost) => {
      return this.modifyReportedPost(reportedPost);
    });
    return {
      reportedPostsCount: modifiedReportedPosts.length,
      reportedPosts: modifiedReportedPosts,
    };
  }
}
