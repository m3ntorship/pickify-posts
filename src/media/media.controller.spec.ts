import { Test, TestingModule } from '@nestjs/testing';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { NotImplementedException } from '@nestjs/common';

describe('MediaController', () => {
  let controller: MediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [MediaService],
    }).compile();

    controller = module.get<MediaController>(MediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addMedia function', () => {
    it('should throw not implemented', () => {
      expect(controller.addMedia).toThrowError(new NotImplementedException());
    });
  });
});
