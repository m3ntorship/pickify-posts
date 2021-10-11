import { Test, TestingModule } from '@nestjs/testing';
import { ExtendedRequest } from 'src/shared/interfaces/expressRequest';
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
    // data
    const params = { optionid: 'uuid' };
    const req = {
      user: { uuid: 'user-uuid' },
    } as ExtendedRequest;
    it('should call service function with optionId', async () => {
      // actions
      controller.addVote(params, req);

      // assertions
      expect(mockService.addVote).toBeCalledWith(params.optionid, req.user);
    });
    it('should return whatever service method returns', () => {
      // actions
      const res = controller.addVote(params, req);

      // assertions
      expect(res).resolves.toEqual(['options']);
    });
  });
});
