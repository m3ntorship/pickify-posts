import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @EventPattern('added_media_data')
  async handleMedia(mediaData: any): Promise<void> {
    await this.mediaService.handleMedia(mediaData);
  }
}
