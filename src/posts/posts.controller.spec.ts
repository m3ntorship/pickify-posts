import { NotImplementedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let controller: PostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [PostsService],
    }).compile();

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
