import { IsUUID } from 'class-validator';

export class PostIdParam {
  @IsUUID()
  postid: string;
}
