import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PostCreationDto {
  @IsOptional()
  @IsString()
  caption?: string;

  @IsNotEmpty()
  type: string;

  @IsBoolean()
  is_hidden: boolean;

  @IsNumber()
  media_count: number;
}
