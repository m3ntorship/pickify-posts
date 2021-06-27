import { IsIn, IsUUID } from 'class-validator';
import { mediaType } from '../../shared/enums/mediaType.enum';

export class MediaDataMessageDto {
  @IsUUID(4, { message: 'entity id is not uuid valid' })
  file_id: string;

  @IsUUID(4, { message: 'entity id is not uuid valid' })
  entity_id: string;

  @IsIn([mediaType.OPTION, mediaType.POST, mediaType.OPTION_GROUP])
  entity_type: string;
}
