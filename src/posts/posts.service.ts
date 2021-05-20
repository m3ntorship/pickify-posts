import { Injectable } from '@nestjs/common';
import { PostIdParam } from 'src/validations/postIdParam.validator';
import { FlagPostFinishedDto } from './dto/flag-post-finished';
import { PostRepository } from './entities/postRepository';

@Injectable()
export class PostsService {
  constructor(private postRepository: PostRepository) {}
  async flagPost(params: PostIdParam, flagPostDto: FlagPostFinishedDto) {
    await this.postRepository.flagPostCreation(
      flagPostDto.finished,
      params.postid,
    );
  }
}
