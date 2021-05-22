import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  caption?: string;

  @IsNotEmpty()
  type: string;

  @IsBoolean()
  is_hidden: boolean;
}
