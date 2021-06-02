import { PostRepository } from './post.repository';
import { PostCreationDto } from '../dto/postCreation.dto';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Post } from './post.entity';
import { getNow } from '../../shared/utils/datetime/now';
import { NotFoundException } from '@nestjs/common';

jest.mock('../../shared/utils/datetime/now');

// Mock typeorm which mocks all its methods and make them return undefined
jest.mock('typeorm', () => ({
  EntityRepository: () => jest.fn(),
  Repository: class Repository {
    findOneOrFail: any;
    constructor() {
      this.findOneOrFail = (options) => {
        const mockPost = { uuid: 'uuid' };
        const {
          where: { uuid },
        } = options;
        if (uuid === mockPost.uuid) {
          return Promise.resolve(mockPost);
        } else return Promise.reject({ message: 'not-found-exception' });
      };
    }
  },
  Entity: () => jest.fn(),
  BaseEntity: class Mock {},
  BeforeInsert: () => jest.fn(),
  BeforeUpdate: () => jest.fn(),
  Column: () => jest.fn(),
  CreateDateColumn: () => jest.fn(),
  PrimaryGeneratedColumn: () => jest.fn(),
  UpdateDateColumn: () => jest.fn(),
  OneToMany: () => jest.fn(),
  ManyToOne: () => jest.fn(),
}));

jest.mock('./post.entity', () => ({
  Post: {
    remove: jest.fn((mockPost) => mockPost),
  },
}));

describe('PostRepository', () => {
  let postRepository: PostRepository;
  const now = getNow().toDate();

  beforeEach(async () => {
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
        post.updated_at = now;
        post.created_at = now;
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
        created_at: now,
        id: 1,
        updated_at: now,
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
        post.updated_at = now;
        post.created_at = now;
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
        created_at: now,
        id: 1,
        updated_at: now,
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
        post.updated_at = now;
        post.created_at = now;
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

  describe('deletPost', () => {
    it('should fail if post doesnt exit', () => {
      expect(postRepository.deletePost('nonexistent-uuid')).rejects.toThrow(
        new NotFoundException('not-found-exception'),
      );
    });
    it('should return deleted post, if post was found and deleted', () => {
      expect(postRepository.deletePost('uuid')).resolves.toEqual({
        uuid: 'uuid',
      });
    });
  });
});
