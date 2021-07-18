import { Test, TestingModule } from '@nestjs/testing';
import { PostIdParam } from '../shared/validations/uuid.validator';
import { OptionsGroupCreationDto } from './dto/optionGroupCreation.dto';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { FlagPostFinishedDto } from './dto/flag-post-finished';
import { PostCreationDto } from './dto/postCreation.dto';
import { ExtendedRequest } from '../shared/interfaces/expressRequest';

describe('PostsController', () => {
  let controller: PostsController;
  const service = {
    flagPost: jest.fn(),
    createOptionGroup: jest.fn().mockResolvedValueOnce('test creating groups'),
    createPost: jest.fn().mockResolvedValue({ uuid: 'test id' }),
    getAllPosts: jest
      .fn()
      .mockReturnValue({ postCount: 1, posts: [{ uuid: 'post1-uuid' }] }),
    getSinglePost: jest.fn().mockResolvedValue({ id: 'post1-id' }),
    deletePost: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useValue: service }],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPost function', () => {
    it('should return a string', async () => {
      // data
      const dto: PostCreationDto = {
        caption: 'test dto',
        type: 'text_poll',
        is_hidden: false,
        media_count: 3,
      };

      const req: any = { user: { uuid: 'user-uuid' } };

      // actions
      const result = await controller.createPost(dto, req);

      // assertions
      expect(result).toEqual({ uuid: 'test id' });
      expect(service.createPost).toBeCalledTimes(1);
      expect(service.createPost).toBeCalledWith(dto, req.user);
    });
  });

  describe('getAllPosts function', () => {
    it('should return object with array of posts and post count', async () => {
      // data
      const req = { user: { uuid: 'user-uuid' } } as ExtendedRequest;

      // actions
      const result = await controller.getAllPosts(req);

      // assertions
      expect(result).toEqual({ postCount: 1, posts: [{ uuid: 'post1-uuid' }] });
      expect(service.getAllPosts).toHaveBeenCalledWith(req.user);
    });
  });

  describe('getSinglePost function', () => {
    it('Should return what service.getSinglePost returns', async () => {
      // data
      const req = { user: { uuid: 'user-uuid' } } as ExtendedRequest;
      const params = { postid: 'post1-id' };

      // actions
      const result = await controller.getSinglePost(params, req);
      expect(result).toEqual({ id: 'post1-id' });
      expect(service.getSinglePost).toBeCalledWith(params.postid, req.user);
    });
  });

  describe('createOptionGroup function', () => {
    it('should call service.createOptionGroup with proper parameters and return its return', async () => {
      // data
      const headers = { Authorization: '3' };
      const param: PostIdParam = { postid: 'test postId' };
      const dto: OptionsGroupCreationDto = {
        groups: [
          {
            name: 'default',
            options: [{ body: 'test option body' }],
          },
        ],
      };

      // actions
      const data = await controller.createOptionGroup(param, dto, headers);

      // assertions
      expect(service.createOptionGroup).toBeCalledWith(
        param.postid,
        dto,
        headers.Authorization,
      );
      expect(data).toEqual('test creating groups');
    });
  });

  describe('flagPost function', () => {
    it('should call service.flagpost with dto & postid', async () => {
      // data
      const dto: FlagPostFinishedDto = { finished: true };
      const params: PostIdParam = { postid: '23242' };
      const req = { user: { uuid: 'user-uuid' } } as ExtendedRequest;

      // actions
      await controller.flagPost(params, dto, req);

      // assertions
      expect(service.flagPost).toBeCalledWith(
        params.postid,
        dto.finished,
        req.user,
      );
    });
  });

  describe('deletePost function', () => {
    it('does not return anything', async () => {
      const params = { postid: 'uuid' };
      const req = { user: { uuid: 'user-uuid' } } as ExtendedRequest;
      const res = await controller.deletePost(params, req);
      expect(res).toBeUndefined();
    });

    it('should call service function with postid and authroization header', async () => {
      const params = { postid: 'uuid' };
      const req = { user: { uuid: 'user-uuid' } } as ExtendedRequest;
      await controller.deletePost(params, req);
      expect(service.deletePost).toBeCalledWith(params.postid, req.user);
    });
  });
});
