import {
  Controller,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ExceptionFilter } from '../shared/exception-filters/rpc-exception.filter';
import { MediaDataMessageDto } from './dto/mediaDataMessage-dto';
import { MediaService } from './media.service';
import * as winston from 'winston';
import { winstonLoggerOptions } from 'src/logging/winston.options';

@Controller('media')
@UsePipes(new ValidationPipe())
@UseFilters(new ExceptionFilter(winston.createLogger(winstonLoggerOptions)))
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @EventPattern('added_media_data')
  async handleMedia(@Payload() mediaData: MediaDataMessageDto): Promise<void> {
    await this.mediaService.handleMedia(mediaData);
  }
}
