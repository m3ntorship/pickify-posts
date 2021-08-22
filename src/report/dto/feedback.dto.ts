import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class FeedbackCreationDto {
  @IsOptional()
  @IsString()
  feedback_body: string;

  @IsNotEmpty()
  feedback_choice: number;
}
