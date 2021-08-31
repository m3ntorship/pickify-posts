export interface Report {
  id: string;
  reporter: User;
}
export interface Post {
  id: string;
  caption: string;
  type: string;
}
export interface User {
  id: string;
  name: string;
}
export interface ReportedPost {
  post: Post;
  reports: Report[];
}
export interface ReportedPosts {
  reportedPostsCount: number;
  reportedPosts: ReportedPost[];
}
