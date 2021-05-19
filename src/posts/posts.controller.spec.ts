import { NotImplementedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let controller: PostsController;
  const service = {
    createPost: jest.fn(() => 'test create'),
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
    it('should return a string', () => {
      const dto = { caption: 'test dto', type: 'text_poll', is_hidden: false };
      expect(controller.createPost(dto)).toBe('test create');
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
    it('should throw not implemented', () => {
      expect(controller.deletePost).toThrowError(new NotImplementedException());
    });
  });
});
