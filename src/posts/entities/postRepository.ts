import { EntityRepository, Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { Post } from './post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  public async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const { caption, is_hidden, user_id, created } = createPostDto;
    const post = new Post();
    post.caption = caption;
    //post.is_hidden = ;
    //post.user_id = ;
    post.created = false;
    post.ready = false;
    await this.save(post);
    return post;
  }
}
