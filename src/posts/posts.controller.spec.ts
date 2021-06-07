import { NotImplementedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PostIdParam } from '../shared/validations/uuid.validator';
import { OptionsGroupCreationDto } from './dto/optionGroupCreation.dto';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { FlagPostFinishedDto } from './dto/flag-post-finished';
import { PostCreationDto } from './dto/postCreation.dto';

describe('PostsController', () => {
  let controller: PostsController;
  const service = {
    flagPost: jest.fn(),
    createOptionGroup: jest.fn().mockResolvedValueOnce('test creating groups'),
    createPost: jest.fn().mockResolvedValue({ uuid: 'test id' }),
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
      const dto: PostCreationDto = {
        caption: 'test dto',
        type: 'text_poll',
        is_hidden: false,
      };

      const result = await controller.createPost(dto);

      expect(result).toEqual({ uuid: 'test id' });

      expect(service.createPost).toBeCalledTimes(1);
      expect(service.createPost).toBeCalledWith(dto);
    });
  });

  describe('getAllPosts function', () => {
    it('should throw not implemented', () => {
      expect(controller.getAllPosts).toThrowError(
        new NotImplementedException(),
      );
    });
  });

  describe('getSinglePost function', () => {
    it('should throw not implemented', () => {
      expect(controller.getSinglePost).toThrowError(
        new NotImplementedException(),
      );
    });
  });

  describe('createOptionGroup function', () => {
    it('should call service.createOptionGroup with proper parameters and return its return', async () => {
      // mocks

      // data
      const param: PostIdParam = { postid: 'test postId' };
      const dto: OptionsGroupCreationDto = {
        groups: [
          {
            name: 'default',
            options: [{ body: 'test option body' }],
          },
        ],
      };
      const data = await controller.createOptionGroup(param, dto);
      expect(service.createOptionGroup).toBeCalledWith(param.postid, dto);
      expect(data).toEqual('test creating groups');
    });
  });

  describe('flagPost function', () => {
    it('should call service.flagpost with dto & postid', async () => {
      const dto: FlagPostFinishedDto = { finished: true };
      const params: PostIdParam = { postid: '23242' };
      await controller.flagPost(params, dto);
      expect(service.flagPost).toBeCalledWith(params, dto);
    });
  });

  describe('deletePost function', () => {
    it('should call service function with postid', async () => {
      const params = { postid: 'uuid' };
      const res = await controller.deletePost(params);
      expect(res).toBeUndefined();
      expect(service.deletePost).toBeCalledWith(params.postid);
    });
  });
});
