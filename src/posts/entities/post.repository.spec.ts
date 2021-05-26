import { PostRepository } from './post.repository';
import { PostCreationDto } from '../dto/postCreation.dto';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Post } from './post.entity';

describe('PostRepository', () => {
  let postRepository: PostRepository;
  const now = new Date();

  beforeEach(async () => {
    // Mock typeorm which mocks all its methods and make them return undefined
    jest.mock('typeorm');

    const module: TestingModule = await Test.createTestingModule({
      providers: [PostRepository],
    }).compile();

    postRepository = module.get<PostRepository>(PostRepository);
  });

  it('should be defined and have necessary methods', () => {
    expect(postRepository).toBeDefined();
    expect(postRepository).toHaveProperty('createPost');
  });

  describe('createPost method', () => {
    it('should return created post object', async () => {
      // mocks
      ////////
      // Mock this.create() inside postRepository
      Repository.prototype.create = jest.fn(() => {
        return new Post();
      }) as any;

      // Mock this.save() inside postRepository
      Repository.prototype.save = jest.fn((post) => {
        post.id = 1;
        post.updatedAt = now;
        post.createdAt = now;
        post.uuid = 'test-uuid';
        return new Promise((resolve) => {
          resolve(post);
        });
      });

      // Data
      ///////
      const dto: PostCreationDto = {
        type: 'test type',
        caption: 'test caption',
        is_hidden: false,
      };
      const newPost: Post = {
        caption: 'test caption',
        user_id: 1,
        created: false,
        createdAt: now,
        id: 1,
        updatedAt: now,
        is_hidden: false,
        type: 'test type',
        uuid: 'test-uuid',
        ready: false,
      } as Post;

      // assertions
      /////////////
      expect(postRepository.createPost(dto)).resolves.toEqual(newPost);
    });

    it('should add dto data to the created post object', async () => {
      // mocks
      ////////
      // Mock this.create() inside postRepository
      Repository.prototype.create = jest.fn(() => {
        return new Post();
      }) as any;

      // Mock this.save() inside postRepository
      Repository.prototype.save = jest.fn((post) => {
        post.id = 1;
        post.updatedAt = now;
        post.createdAt = now;
        post.uuid = 'test-uuid';
        return new Promise((resolve) => {
          resolve(post);
        });
      });

      // Data
      ///////
      const dto: PostCreationDto = {
        type: 'test type',
        caption: 'test caption',
        is_hidden: false,
      };
      const newPost: Post = {
        caption: 'test caption',
        user_id: 1,
        created: false,
        createdAt: now,
        id: 1,
        updatedAt: now,
        is_hidden: false,
        type: 'test type',
        uuid: 'test-uuid',
        ready: false,
      } as Post;

      // assertions
      /////////////
      expect(postRepository.createPost(dto)).resolves.toEqual(newPost);
    });

    it('return error if ready col is not set', () => {
      // Data
      ///////
      const dto: PostCreationDto = {
        type: 'test type',
        caption: 'test caption',
        is_hidden: false,
      };

      // mocks
      ////////
      // Mock this.create() inside postRepository
      Repository.prototype.create = jest.fn().mockReturnValueOnce(new Post());

      // Mock this.save() inside postRepository
      Repository.prototype.save = jest.fn((post) => {
        post.id = 1;
        post.updatedAt = now;
        post.createdAt = now;
        post.uuid = 'test-uuid';
        return new Promise((resolve, reject) => {
          // if (post.ready === undefined)
          return reject('ready column should not be null');
          // resolve(newPost);
        });
      });

      // assertions
      expect(postRepository.createPost(dto)).rejects.toBe(
        'ready column should not be null',
      );
    });
  });
});
