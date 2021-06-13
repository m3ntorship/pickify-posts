import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Post } from './post.entity';
import { getNow } from '../../shared/utils/datetime/now';
import { OptionsGroupRepository } from './optionsGroup.repository';
import { OptiosnGroup } from './optionsGroup.entity';
import { NotFoundException } from '@nestjs/common';

jest.mock('../../shared/utils/datetime/now');

// Mock typeorm which mocks all its methods and make them return undefined
jest.mock('typeorm', () => ({
  EntityRepository: () => jest.fn(),
  Repository: class Repository {
    manager: any;
    constructor() {
      this.manager = {
        getRepository: (Entity) => ({
          findOne: jest.fn((search) => {
            const post = {
              id: 1,
              uuid: 'test-with-existing-post',
            } as Post;
            return new Promise((resolve, reject) => {
              if (search.where.uuid === 'test-with-existing-post') {
                resolve(post);
              } else {
                reject(
                  new NotFoundException(
                    'Post with id: any-post-uuid not found',
                  ),
                );
              }
            });
          }),
        }),
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

describe('OptionGroup Repository', () => {
  let groupRepository: OptionsGroupRepository;
  const now = getNow().toDate();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OptionsGroupRepository],
    }).compile();

    groupRepository = module.get<OptionsGroupRepository>(
      OptionsGroupRepository,
    );
  });

  it('should be defined and have necessary methods', () => {
    expect(groupRepository).toBeDefined();
    expect(groupRepository).toHaveProperty('createGroup');
  });

  describe('createGroup method', () => {
    it('should return 404 error if post not found', async () => {
      // Data
      ///////

      const groupName = 'test group name';
      // if passed any postid other than "test-with-existing-post", it will throw error
      // and pass the test as this postid is the only once found in mocked database above
      const postid = 'any-post-uuid';

      // mocks
      ////////
      // use mocked version of Repository in beforeEach above

      // assertions
      /////////////
      expect(groupRepository.createGroup(postid, groupName)).rejects.toEqual(
        new NotFoundException('Post with id: any-post-uuid not found'),
      );
    });

    it('should return new created group', async () => {
      // Data
      ///////
      const groupName = 'test group name';

      const postid = 'test-with-existing-post';

      const post = {
        id: 1,
        uuid: 'test-with-existing-post',
      } as Post;

      const newGroup = {
        created_at: now,
        updated_at: now,
        uuid: 'test-group-uuid',
        id: 1,
        name: 'test group name',
        post: post,
      } as OptiosnGroup;

      // mocks
      ///////
      // Mock this.create() inside optionsGroupRepository
      Repository.prototype.create = jest.fn(() => {
        return new OptiosnGroup();
      }) as any;

      // Mock this.save() inside optionsGroupRepository
      Repository.prototype.save = jest.fn((group) => {
        group.id = 1;
        group.updated_at = now;
        group.created_at = now;
        group.uuid = 'test-group-uuid';
        return new Promise((resolve) => {
          resolve(group);
        });
      });

      // assertions
      expect(groupRepository.createGroup(postid, groupName)).resolves.toEqual(
        newGroup,
      );
    });
  });
});
