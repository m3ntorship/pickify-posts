import { Injectable, ValidationPipe } from '@nestjs/common';
import { ClassTransformer } from 'class-transformer';
import { Validator } from 'class-validator';
import { MediaDataMessageDto } from './dto/mediaDataMessage-dto';

@Injectable()
export class MediaService {
  constructor(
    private classTransformer: ClassTransformer,
    private validation: Validator,
    private validationPipe: ValidationPipe,
  ) {}
  async handleMedia(mediaData: MediaDataMessageDto) {
    // validate message
    // const classTransformer = new ClassTransformer();
    const entity = this.classTransformer.plainToClass(
      MediaDataMessageDto,
      mediaData,
    );

    const errors = await this.validation.validate(entity);
    console.log(
      'here to have the validation errors. Use it to throw error',
      errors,
    );

    console.log(`mediaData-------------`, mediaData);
  }
}
