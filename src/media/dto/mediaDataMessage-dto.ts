import { IsIn, IsString, IsUUID } from 'class-validator';
import { mediaType } from 'src/shared/enums/mediaType.enum';

export class MediaDataMessageDto {
  @IsString()
  file_url: string;

  @IsUUID(4, { message: 'entity id is not uuid valid' })
  entity_id: string;

  @IsIn([mediaType.OPTION, mediaType.POST, mediaType.OPTION_GROUP])
  entity_type: string;
}
