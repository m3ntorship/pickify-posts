import { Injectable } from '@nestjs/common';
import { PostIdParam } from 'src/validations/postIdParam.validator';
import { FlagPostFinishedDto } from './dto/flag-post-finished';

@Injectable()
export class PostsService {
  flagPost(params: PostIdParam, flagPostDto: FlagPostFinishedDto) {
    const test =
      'just to be able to commit without having linting errors due to empty flagPost function';
  }
}
