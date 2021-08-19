import { IsNumberString, IsOptional } from 'class-validator';

export class QueryParameters {
  @IsOptional()
  @IsNumberString({}, { message: 'offset should be a number' })
  // @IsNumber({}, { message: 'offset should be a number' })
  offset: number;

  @IsOptional()
  @IsNumberString({}, { message: 'limit should be a number' })
  // @IsNumber({}, { message: 'limit should be a number' })
  limit: number;
}
