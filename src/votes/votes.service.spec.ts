import { Test, TestingModule } from '@nestjs/testing';
import { VoteRepository } from './entities/votes.repository';
import { VotesService } from './votes.service';

const mockRepository = {
  addVote: jest.fn(() => Promise.resolve(['options'])),
};

describe('VotesService', () => {
  let service: VotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        {
          provide: VoteRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<VotesService>(VotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service).toHaveProperty('addVote');
  });

  describe('addVote method', () => {
    it('should call repository fn with optionId', () => {
      service.addVote('uuid', 3);
      expect(mockRepository.addVote).toHaveBeenCalledWith('uuid', 3);
    });
    it('should return what repository method returns', () => {
      const res = service.addVote('uuid', 3);
      expect(res).resolves.toEqual(['options']);
    });
  });
});
