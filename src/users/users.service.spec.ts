import { Test, TestingModule } from '@nestjs/testing';
import { QueryParameters } from '../shared/validations/query.validator';
import { OptionRepository } from '../posts/entities/option.repository';
import { OptionsGroupRepository } from '../posts/entities/optionsGroup.repository';
import { PostRepository } from '../posts/entities/post.repository';
import { PostsService } from '../posts/posts.service';
import { User } from '../users/entities/user.entity';
import { UserRepository } from './entities/user.repository';
import { UsersService } from './users.service';
import { getNow } from '../shared/utils/datetime';
import { Post } from '../posts/interfaces/getPosts.interface';

describe('UserService', () => {
  let service: UsersService;
  let postRepo: PostRepository;
  let postService: PostsService;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UserRepository,
        PostRepository,
        PostsService,
        OptionsGroupRepository,
        OptionRepository,
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    postRepo = module.get<PostRepository>(PostRepository);
    postService = module.get<PostsService>(PostsService);
    userRepo = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service).toHaveProperty('getUserPosts');
  });

  describe('getUsersPosts function', () => {
    it('should return object of posts count and array of posts', async () => {
      //data
      const userid = 'user-id';
      const query = { limit: 10, offset: 0 } as QueryParameters;
      const currentUser = { uuid: 'user2-uuid' } as User;
      const returnedUser = { uuid: 'user-id' } as User;

      const post = {
        uuid: 'test-post-uuid',
        ready: true,
        caption: 'test-post-caption',
        is_hidden: false,
        created_at: getNow().toDate(),
        type: 'text poll',
        user: {
          uuid: userid,
          name: 'test',
          profile_pic: 'test-url',
        },
        media: [{ url: 'test-media-url' }],
        groups: [
          {
            uuid: 'test-group-uuid',
            name: 'test-group-name',
            options: [
              {
                vote_count: 2,
                body: 'test-option-body',
                uuid: 'test-option-uuid',
                voted: false,
              },
            ],
          },
        ],
      };
      const postsInDB = [post];
      const modifiedPost: Post = {
        id: post.uuid,
        caption: post.caption,
        is_hidden: post.is_hidden,
        created_at: post.created_at,
        type: post.type,
        user: {
          id: post.user.uuid,
          name: post.user.name,
          profile_pic: post.user.profile_pic,
        },
        media: post.media,
        options_groups: {
          groups: [
            {
              id: post.groups[0].uuid,
              name: post.groups[0].name,
              options: [
                {
                  id: post.groups[0].options[0].uuid,
                  body: post.groups[0].options[0].body,
                  vote_count: post.groups[0].options[0].vote_count,
                  voted: post.groups[0].options[0].voted,
                },
              ],
            },
          ],
        },
      };
      const returnedPosts = {
        postsCount: postsInDB.length,
        posts: [modifiedPost],
      };

      //mocks

      userRepo.getUser = jest.fn().mockResolvedValue(returnedUser);
      if (userid === currentUser.uuid) {
        postRepo.getCurrentUserPosts = jest.fn().mockResolvedValue(postsInDB);
      } else {
        postRepo.getUserPosts = jest.fn().mockResolvedValue(postsInDB);
      }
      //action
      const result = await service.getUserPosts(userid, query, currentUser);

      //assertions
      expect(result).toEqual(returnedPosts);
    });
  });
});
