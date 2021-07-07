import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionRepository } from 'src/posts/entities/option.repository';
import { OptionsGroupRepository } from 'src/posts/entities/optionsGroup.repository';
import { PostRepository } from 'src/posts/entities/post.repository';
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
  providers: [MediaService],
})
export class MediaModule {}
