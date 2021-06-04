import { NotImplementedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';

describe('VotesController', () => {
  let controller: VotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotesController],
      providers: [{ provide: VotesService, useValue: { addVote: jest.fn() } }],
    }).compile();

    controller = module.get<VotesController>(VotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('addVote function', () => {
  //   it('should throw not implemented', () => {
  //     expect(controller.addVote).toThrowError(new NotImplementedException());
  //   });
  // });
});
