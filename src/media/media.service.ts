import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  async handleMedia(mediaData: any) {
    console.log(`mediaData-------------`, mediaData);
  }
}
