import { IsNumber, IsNumberString, IsOptional } from 'class-validator';

export class Queries {
  @IsOptional()
  @IsNumberString({}, { message: 'offset should be a number' })
  // @IsNumber({}, { message: 'offset should be a number' })
  offset: number;

  @IsOptional()
  @IsNumberString({}, { message: 'limit should be a number' })
  // @IsNumber({}, { message: 'limit should be a number' })
  limit: number;
}
