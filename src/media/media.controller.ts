import { Controller, NotImplementedException, Post } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('/')
  addMedia() {
    throw new NotImplementedException();
  }
}
