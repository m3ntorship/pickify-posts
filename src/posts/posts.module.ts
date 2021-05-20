import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './entities/postRepository';
import { OptionsGroupRepository } from './entities/optionsGroup.repository';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository, OptionsGroupRepository])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
