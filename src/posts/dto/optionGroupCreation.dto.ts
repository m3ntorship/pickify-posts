import { Type } from 'class-transformer';
import { ValidateNested, IsNotEmpty } from 'class-validator';

export class OptionDto {
  @IsNotEmpty()
  body: string;
}

export class OptionsGroupDto {
  @IsNotEmpty()
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
