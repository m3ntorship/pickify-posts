import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaSubscriber } from './subscribers/media.subscribers';
import { OptionRepository } from '../posts/entities/option.repository';
import { OptionsGroupRepository } from '../posts/entities/optionsGroup.repository';
import { PostRepository } from '../posts/entities/post.repository';
import { MediaRepository } from './entities/media.repository';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MediaRepository,
      PostRepository,
      OptionsGroupRepository,
      OptionRepository,
    ]),
  ],
  controllers: [MediaController],
  providers: [MediaService, MediaSubscriber],
})
export class MediaModule {}
