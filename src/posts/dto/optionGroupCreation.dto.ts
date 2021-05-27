import { Type } from 'class-transformer';
import { ValidateNested, IsIn } from 'class-validator';

export class OptionDto {
  body?: string;
  vote_count: number;
}

export class OptionsGroupDto {
  @IsIn(['test1', 'test2'])
  name: string;
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options: OptionDto[];
}

export class OptionsGroupCreationDto {
  @ValidateNested({ each: true })
  @Type(() => OptionsGroupDto)
  groups: OptionsGroupDto[];
}
