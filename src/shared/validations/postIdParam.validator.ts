import { IsUUID } from 'class-validator';

export class PostIdParam {
  @IsUUID(4, { message: 'post id is not correct' })
  postid: string;
}
