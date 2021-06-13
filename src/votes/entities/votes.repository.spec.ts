import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { VoteRepository } from './votes.repository';

const mockOption = {
  vote_count: 0,
  uuid: 'correct-uuid',
  votes: [{ user_id: 3 }],
};

const mockVotes = [];

jest.mock('typeorm', () => ({
  EntityRepository: () => jest.fn(),
  Repository: class Repository {
    create: any;
    constructor() {
      this.create = jest.fn(() => ({
        option: {},
        save: jest.fn(() => {
          mockVotes.push({ optionId: 'id' });
        }),
      }));
    }
  },
  Entity: () => jest.fn(),
  BaseEntity: class Mock {},
  BeforeInsert: () => jest.fn(),
  BeforeUpdate: () => jest.fn(),
  Column: () => jest.fn(),
  CreateDateColumn: () => jest.fn(),
  PrimaryGeneratedColumn: () => jest.fn(),
  UpdateDateColumn: () => jest.fn(),
  OneToMany: () => jest.fn(),
  ManyToOne: () => jest.fn(),
}));

jest.mock('../../posts/entities/option.entity', () => ({
  Option: class MockClass {
    static findOne(search_options: { where: { uuid: string } }) {
      const {
        where: { uuid },
      } = search_options;
      if (uuid === mockOption.uuid)
        return Promise.resolve({
          ...mockOption,
          optionsGroup: {
            post: { created: true },
            options: [{ ...mockOption }, { ...mockOption }],
          },
          save: jest.fn(() => {
            mockOption.vote_count++;
          }),
        });
      else return Promise.resolve(undefined);
    }
  },
}));

describe('Votes Repository', () => {
  let voteRepository: VoteRepository;
  beforeEach(async () => {
    const mockModule: TestingModule = await Test.createTestingModule({
      providers: [VoteRepository],
    }).compile();
    voteRepository = mockModule.get<VoteRepository>(VoteRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockOption.vote_count = 0;
  });

  it('should be defined and have necessary methods', () => {
    expect(voteRepository).toBeDefined();
    expect(voteRepository).toHaveProperty('addVote');
  });

  describe('addVote method', () => {
    it('should throw if option wasnt found', () => {
      const response = voteRepository.addVote('nonexistent-uuid', 2);
      expect(response).rejects.toThrow(
        new NotFoundException(`Option with id:nonexistent-uuid not found`),
      );
    });
    it('should save a new record to votes', async () => {
      const prevVotesRecords = mockVotes.length;
      await voteRepository.addVote('correct-uuid', 2);
      expect(mockVotes.length).toBe(prevVotesRecords + 1);
    });
    it('should increment vote count by 1', async () => {
      const prevVoteCount = mockOption.vote_count;
      await voteRepository.addVote('correct-uuid', 2);
      expect(mockOption.vote_count).toBe(prevVoteCount + 1);
    });
    it('should respond with all option votes in the same group', async () => {
      const response = await voteRepository.addVote('correct-uuid', 2);
      expect(response[0]).toHaveProperty('votes_count');
      expect(response[0]).toHaveProperty('optionId');
    });
  });
});
