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
  async getUserReportsCount(userId: string) {
    return (
      this.createQueryBuilder('postsReport')
        .leftJoin('postsReport.reporter', 'user')
        .where('user.uuid = :Id', { Id: userId })
        .andWhere('DATE(postsReport.created_at) = :date', {
          date: new Date().toISOString().slice(0, 10),
        })
        //  .andWhere(`DATE_TRUNC('day','postsReport.created_at') =:date`,{date:new Date().toISOString().slice(0, 10);})
        .getCount()
    );
  }
}
