import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { PostsReport } from './postsReport.entity';

@EntityRepository(PostsReport)
export class PostsReportRepository extends Repository<PostsReport> {
  async createPostsReport(post: Post, reporter: User): Promise<void> {
    const report: PostsReport = this.create();
    report.reporter = reporter;
    report.post = post;
    await this.save(report);
  }

  async getAllPostsReports(): Promise<PostsReport[]> {
    return await this.createQueryBuilder('postsReport')
      .leftJoinAndSelect('postsReport.reporter', 'user')
      .leftJoinAndSelect('postsReport.post', 'post')
      .getMany();
  }
}
