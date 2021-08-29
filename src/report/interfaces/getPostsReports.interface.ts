import { PostsReport } from '../entities/postsReport.entity';

export interface PostsReports {
  postsReportsCount: number;
  postsReports: PostsReport[];
}
