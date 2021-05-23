import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PostCreationDto {
  caption?: string;

  @IsNotEmpty()
  type: string;

  @IsBoolean()
  is_hidden: boolean;
}
