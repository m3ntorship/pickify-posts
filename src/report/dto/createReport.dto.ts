import { IsString, IsUUID } from 'class-validator';

export class CreatePostsReportDTO {
  @IsUUID(4, { message: 'post id is not a valid uuid' })
  post_id: string;
  @IsString()
  report_type: string;
}
