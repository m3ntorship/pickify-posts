import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './entities/post.repository';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { OptionRepository } from './entities/option.repository';
import { OptionsGroupRepository } from './entities/optionsGroup.repository';
import { UserRepository } from './entities/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostRepository,
      OptionsGroupRepository,
      OptionRepository,
      UserRepository,
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
