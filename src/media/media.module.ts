import { Module, ValidationPipe } from '@nestjs/common';
import { ClassTransformer } from 'class-transformer';
import { Validator } from 'class-validator';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService, Validator, ClassTransformer, ValidationPipe],
})
export class MediaModule {}
