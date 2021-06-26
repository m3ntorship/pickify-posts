import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MediaDataMessageDto } from './dto/mediaDataMessage-dto';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @EventPattern('added_media_data')
  async handleMedia(mediaData: MediaDataMessageDto): Promise<void> {
    await this.mediaService.handleMedia(mediaData);
  }
}
