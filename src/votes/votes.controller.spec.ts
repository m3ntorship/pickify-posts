import { Test, TestingModule } from '@nestjs/testing';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';

const mockService = { addVote: jest.fn(() => Promise.resolve(['options'])) };

describe('VotesController', () => {
  let controller: VotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotesController],
      providers: [
        {
          provide: VotesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<VotesController>(VotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addVote', () => {
    const params = { optionid: 'uuid' };
    it('should call service function with optionId', async () => {
      controller.addVote(params, { Authorization: '3' });
      expect(mockService.addVote).toBeCalledWith(params.optionid, 3);
    });
    it('should return whatever service method returns', () => {
      const res = controller.addVote(params, { Authorization: '3' });
      expect(res).resolves.toEqual(['options']);
    });
  });
});
