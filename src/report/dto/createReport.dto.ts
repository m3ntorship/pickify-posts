import { IsString, IsUUID } from 'class-validator';

export class CreatePostsReportDTO {
  @IsUUID(4, { message: 'post id is not a valid uuid' })
  postId: string;
  @IsString()
  reportType: string;
}
