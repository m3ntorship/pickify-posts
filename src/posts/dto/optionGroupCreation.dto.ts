import { Type } from 'class-transformer';
import { ValidateNested, IsNotEmpty, IsString } from 'class-validator';

export class OptionDto {
  @IsNotEmpty()
  @IsString()
  body: string;
}

export class OptionsGroupDto {
  @IsNotEmpty()
  @IsString()
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
