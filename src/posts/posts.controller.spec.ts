import { NotImplementedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostCreationDto } from './dto/postCreation.dto';

describe('PostsController', () => {
  let controller: PostsController;
  const service = {
    createPost: jest.fn().mockResolvedValue({ uuid: 'test id' }),
    deletePost: jest.fn(),
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
    it('should throw not implemented', () => {
      expect(controller.createOptionGroup).toThrowError(
        new NotImplementedException(),
      );
    });
  });

  describe('flagPost function', () => {
    it('should throw not implemented', () => {
      expect(controller.flagPost).toThrowError(new NotImplementedException());
    });
  });

  describe('deletePost function', () => {
    it('should call service function with postid', () => {
      const postid = 'uuid';
      controller.deletePost(postid);
      expect(service.deletePost).toBeCalledWith(postid);
    });
  });
});
