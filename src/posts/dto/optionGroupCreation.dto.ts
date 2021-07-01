import { Type } from 'class-transformer';
import { ValidateNested, IsNotEmpty, IsOptional } from 'class-validator';

export class OptionDto {
  @IsNotEmpty()
  body: string;
}

export class OptionsGroupDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options: OptionDto[];
}

export class OptionsGroupCreationDto {
  @ValidateNested({ each: true })
  @Type(() => OptionsGroupDto)
  groups: OptionsGroupDto[];
}
