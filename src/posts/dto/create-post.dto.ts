import { IsBoolean, IsIn } from 'class-validator';

export class CreatePostDto {
  caption?: string;

  @IsIn(['text_poll', 'image_poll', 'mini_survey'])
  type: 'text_poll' | 'image_poll' | 'mini_survey';

  @IsBoolean()
  is_hidden: boolean;
}
