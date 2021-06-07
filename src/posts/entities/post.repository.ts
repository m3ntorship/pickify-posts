import { EntityRepository, Repository } from 'typeorm';
import { PostCreationDto } from '../dto/postCreation.dto';
import { posts } from '../interfaces/getPosts.interface';
import { Post } from './post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  public async createPost(postCreationDto: PostCreationDto): Promise<Post> {
    const { caption, type, is_hidden } = postCreationDto;
    const post = this.create();
    post.caption = caption;
    post.type = type;
    post.is_hidden = is_hidden;
    post.user_id = 1;
    post.created = false;
    post.ready = false;
    return await this.save(post);
  }
  async getAllPosts(): Promise<Post[]> {
    const posts = await this.createQueryBuilder('posts')
      .select([
        'posts.uuid',
        'posts.caption',
        'posts.is_hidden',
        'posts.created_at',
        'posts.type',
        'groups.uuid',
        'groups.name',
        'options.uuid',
        'options.vote_count',
        'options.body',
      ])
      .leftJoin('posts.groups', 'groups')
      .leftJoin('groups.options', 'options')
      .getMany();
    return posts;
  }
}
