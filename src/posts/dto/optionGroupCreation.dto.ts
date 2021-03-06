import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsOptional,
  ArrayMaxSize,
  IsString,
  ArrayMinSize,
} from 'class-validator';

export class OptionDto {
  @IsOptional()
  @IsString()
  body?: string;
}

export class OptionsGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  @ArrayMinSize(2, { message: `Min options number in a group is 2` })
  @ArrayMaxSize(4, { message: `Max options number in a group is 4` })
  options: OptionDto[];
}

export class OptionsGroupCreationDto {
  @ValidateNested({ each: true })
  @Type(() => OptionsGroupDto)
  @ArrayMaxSize(4, {
    message: `Max groups number in a post is 4`,
  })
  groups: OptionsGroupDto[];
}
