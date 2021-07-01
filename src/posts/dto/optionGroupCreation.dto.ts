import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsNotEmpty,
  IsOptional,
  ArrayMaxSize,
} from 'class-validator';

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
