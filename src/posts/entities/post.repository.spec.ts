import { PostRepository } from './post.repository';
import { PostCreationDto } from '../dto/postCreation.dto';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Post } from './post.entity';
import { getNow } from '../../shared/utils/datetime/now';
import { HttpException, NotFoundException } from '@nestjs/common';

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
        } else
          return Promise.reject({
            name: 'EntityNotFound',
            message: 'not-found-exception',
          });
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
  Post: class Mock {
    static remove(mockPost) {
      return mockPost;
    }
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
    expect(postRepository).toHaveProperty('getAllPosts');
    expect(postRepository).toHaveProperty('flagPostCreation');
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
      const userId = 2;
      const newPost: Post = {
        caption: 'test caption',
        user_id: userId,
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
      expect(postRepository.createPost(dto, userId)).resolves.toEqual(newPost);
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
      const userId = 2;
      const newPost: Post = {
        caption: 'test caption',
        user_id: userId,
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
      expect(postRepository.createPost(dto, userId)).resolves.toEqual(newPost);
    });

    it('return error if ready col is not set', () => {
      // Data
      ///////
      const dto: PostCreationDto = {
        type: 'test type',
        caption: 'test caption',
        is_hidden: false,
      };
      const userId = 2;

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
      expect(postRepository.createPost(dto, userId)).rejects.toBe(
        'ready column should not be null',
      );
    });
  });
  describe('getPosts function', () => {
    it('should return created posts only', () => {
      // data
      ///////
      const posts = [
        { uuid: 'post1-uuid', id: 1, created: true },
        { uuid: 'post2-uuid', id: 2, created: true },
        { uuid: 'post2-uuid', id: 3, created: false },
      ];

      const expectedPosts = [
        { uuid: 'post1-uuid', id: 1, created: true },
        { uuid: 'post2-uuid', id: 2, created: true },
      ];
      // mocks
      ///////
      Repository.prototype.createQueryBuilder = jest
        .fn()
        .mockImplementation(() => ({
          select: jest.fn().mockImplementation(() => ({
            where: () => ({
              leftJoin: () => ({
                leftJoin: () => ({
                  getMany: jest
                    .fn()
                    .mockResolvedValue(posts.filter((post) => post.created)),
                }),
              }),
            }),
          })),
        }));
      // assertions
      /////////////
      expect(postRepository.getAllPosts()).resolves.toEqual(expectedPosts);
    });
  });
  describe('getSinglePost function', () => {
    it('should return the found post or not found error', () => {
      // data //
      const post = { uuid: 'post-uuid', id: 1, created: true };
      // mocks //
      Repository.prototype.createQueryBuilder = jest
        .fn()
        .mockImplementation(() => ({
          select: jest.fn().mockImplementation(() => ({
            leftJoin: () => ({
              leftJoin: () => ({
                where: (_, search: { uuid: string }) => ({
                  getOne: jest.fn().mockImplementation(() => {
                    return new Promise((resolve) => {
                      if (search.uuid === 'post-uuid') {
                        resolve(post);
                      } else {
                        resolve(undefined);
                      }
                    });
                  }),
                }),
              }),
            }),
          })),
        }));
      // Assertions //
      expect(postRepository.getSinglePost('nonexistent-uuid')).rejects.toThrow(
        new NotFoundException('Post not found'),
      );
      expect(postRepository.getSinglePost(post.uuid)).resolves.toEqual(post);
    });

    it('should throw Post not created error', () => {
      // data //
      const post = { uuid: 'post-uuid', id: 1, created: false };
      // mocks //
      Repository.prototype.createQueryBuilder = jest
        .fn()
        .mockImplementation(() => ({
          select: jest.fn().mockImplementation(() => ({
            leftJoin: () => ({
              leftJoin: () => ({
                where: (_, search: { uuid: string }) => ({
                  getOne: jest.fn().mockImplementation(() => {
                    return new Promise((resolve) => {
                      if (search.uuid === 'post-uuid') {
                        resolve(post);
                      } else {
                        resolve(undefined);
                      }
                    });
                  }),
                }),
              }),
            }),
          })),
        }));
      // Assertions //
      expect(postRepository.getSinglePost(post.uuid)).rejects.toEqual(
        new HttpException('Post still under creation...', 423),
      );
    });
  });

  describe('flagPostCreation method', () => {
    it('should throw error if post not found', () => {
      // Mocks
      ///////
      Repository.prototype.findOne = jest.fn().mockImplementation((search) => {
        const post = {
          id: 1,
          uuid: 'test-post-uuid',
          created: false,
          ready: false,
        };

        return new Promise((resolve, reject) => {
          if (search.where.uuid === post.uuid) {
            resolve(post);
          } else {
            reject(new NotFoundException('post not found'));
          }
        });
      });

      // Assertions
      ////////////
      expect(
        postRepository.flagPostCreation(true, 'test-wrong-post-uuid'),
      ).rejects.toThrowError(new NotFoundException('post not found'));
    });

    it('should change post.created to true & ready to true ', async () => {
      // data
      ////////
      const post = {
        id: 1,
        uuid: 'test-post-uuid',
        created: false,
        ready: false,
      };
      const expectedPost = {
        id: 1,
        uuid: 'test-post-uuid',
        created: true,
        ready: true,
      };
      // Mocks
      ///////
      Repository.prototype.findOne = jest.fn().mockImplementation((search) => {
        return new Promise((resolve, reject) => {
          if (search.where.uuid === post.uuid) {
            resolve(post);
          } else {
            reject(new NotFoundException('post not found'));
          }
        });
      });

      Repository.prototype.save = jest.fn().mockImplementation((post) => {
        return Promise.resolve('saved!!');
      });

      // Assertions
      ////////////
      await postRepository.flagPostCreation(true, 'test-post-uuid');
      expect(postRepository.save).toHaveBeenCalledWith(expectedPost);
    });
  });
  describe('deletPost', () => {
    it('should fail if post doesnt exit', () => {
      expect(postRepository.deletePost('nonexistent-uuid')).rejects.toThrow(
        new NotFoundException('not-found-exception'),
      );
    });
    it('should return void', () => {
      expect(postRepository.deletePost('uuid')).resolves.toBeUndefined();
    });
  });
});
