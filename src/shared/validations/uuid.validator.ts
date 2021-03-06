import { IsUUID } from 'class-validator';

export class PostIdParam {
  @IsUUID(4, { message: 'post id is not correct' })
  postid: string;
}

export class OptionIdParam {
  @IsUUID(4, { message: 'option id is not correct' })
  optionid: string;
}
export class UserIdParam {
  @IsUUID(4, { message: 'user id is not correct' })
  userId: string;
}
