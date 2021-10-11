import { IsBoolean } from 'class-validator';

export class FlagPostFinishedDto {
  @IsBoolean()
  finished: boolean;
}
