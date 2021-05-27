import { NotImplementedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PostIdParam } from 'src/shared/validations/postIdParam.validator';
import { OptionsGroupCreationDto } from './dto/optionGroupCreation.dto';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let controller: PostsController;
  const service = {
    createOptionGroup: jest.fn().mockResolvedValueOnce('test creating groups'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [PostsService],
    })
      .overrideProvider(PostsService)
      .useValue(service)
      .compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPost function', () => {
    it('should throw not implemented', () => {
      expect(controller.createPost).toThrowError(new NotImplementedException());
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
            options: [{ vote_count: 2, body: 'test option body' }],
          },
        ],
      };
      const data = await controller.createOptionGroup(param, dto);
      expect(service.createOptionGroup).toBeCalledWith(param.postid, dto);
      expect(data).toEqual('test creating groups');
    });
  });

  describe('flagPost function', () => {
    it('should throw not implemented', () => {
      expect(controller.flagPost).toThrowError(new NotImplementedException());
    });
  });

  describe('deletePost function', () => {
    it('should throw not implemented', () => {
      expect(controller.deletePost).toThrowError(new NotImplementedException());
    });
  });
});
