import {
  IsNotEmpty,
  isNumber,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export class FeedbackCreationDto {
  @IsOptional()
  @IsString()
  feedback_body?: string;

  @IsNotEmpty()
  @IsNumber()
  feedback_rating: number;
}
