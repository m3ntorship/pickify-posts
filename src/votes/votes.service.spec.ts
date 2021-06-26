import {
  ConflictException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../posts/entities/user.repository';
import { Option } from '../posts/entities/option.entity';
import { OptionRepository } from '../posts/entities/option.repository';
import { VoteRepository } from './entities/votes.repository';
import { VotesService } from './votes.service';

describe('VotesService', () => {
  let votesService: VotesService;
  let optionRepo: OptionRepository;
  let voteRepo: VoteRepository;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        VoteRepository,
        OptionRepository,
        UserRepository,
      ],
    }).compile();

    votesService = module.get<VotesService>(VotesService);
    voteRepo = module.get<VoteRepository>(VoteRepository);
    optionRepo = module.get<OptionRepository>(OptionRepository);
    userRepo = module.get<UserRepository>(UserRepository);
  });

  it('should be defined and have the necessarry methods', () => {
    expect(votesService).toBeDefined();
    expect(votesService).toHaveProperty('addVote');
  });

  describe('addVote method', () => {
    it('should add vote to option & return vote_count & ids of all options in the group', async () => {
      // data
      const userId = 'test-user-uuid';
      const foundUser = { uuid: userId };
      const expectedResponse = [
        { votes_count: 3, optionId: 'option1-test-uuid' },
        { votes_count: 0, optionId: 'option2-test-uuid' },
      ];

      const optionInDB = {
        id: 1,
        uuid: 'option1-test-uuid',
        vote_count: 2,
        optionsGroup: {
          post: {
            created: true,
          },
          options: [
            { uuid: 'option1-test-uuid', vote_count: 2 },
            { uuid: 'option2-test-uuid', vote_count: 0 },
          ],
        },
        votes: [
          { id: 1, user: { uuid: 'test-user1-uuid' } },
          { id: 2, user: { uuid: 'test-user2-uuid' } },
        ],
      };

      // mocks
      optionRepo.findDetailedOptionById = jest.fn().mockImplementation(() => {
        return Promise.resolve(optionInDB);
      });

      voteRepo.addVote = jest.fn().mockResolvedValueOnce(undefined);

      optionRepo.incrementVoteCount = jest
        .fn()
        .mockImplementation((option: Option) => {
          option.vote_count++;
          return Promise.resolve(option);
        });

      userRepo.findOne = jest.fn().mockResolvedValue(foundUser);

      // assertions
      expect(
        votesService.addVote('option1-test-uuid', userId),
      ).resolves.toEqual(expectedResponse);
    });
    it('should throw not found error if option not found', () => {
      // data
      const userId = 'test-user-uuid';

      // mocks
      optionRepo.findDetailedOptionById = jest.fn().mockImplementation(() => {
        return Promise.resolve(undefined);
      });

      // assertions
      expect(
        votesService.addVote('option1-test-uuid', userId),
      ).rejects.toThrowError(
        new NotFoundException('Option with id:option1-test-uuid not found'),
      );
    });

    it('should throw locked error if post is not created yet', () => {
      // data
      const userId = 'test-user-uuid';
      const optionInDB = {
        id: 1,
        uuid: 'option1-test-uuid',
        vote_count: 2,
        optionsGroup: {
          post: {
            uuid: 'post-test-uuid',
            created: false,
          },
          options: [
            { uuid: 'option1-test-uuid', vote_count: 2 },
            { uuid: 'option2-test-uuid', vote_count: 0 },
          ],
        },
        votes: [
          { id: 1, user: { uuid: userId } },
          { id: 2, user: { uuid: 'test-user2-uuid' } },
        ],
      };

      // mocks
      optionRepo.findDetailedOptionById = jest.fn().mockImplementation(() => {
        return Promise.resolve(optionInDB);
      });

      // assertions
      expect(
        votesService.addVote('option1-test-uuid', userId),
      ).rejects.toThrowError(
        new HttpException(
          'Post:post-test-uuid with option:option1-test-uuid still under creation...',
          423,
        ),
      );
    });

    it('should throw conflict error if user voted before', () => {
      // data
      const userId = 'test-user-uuid';
      const foundUser = { uuid: userId };
      const optionInDB = {
        id: 1,
        uuid: 'option1-test-uuid',
        vote_count: 2,
        optionsGroup: {
          post: {
            uuid: 'post-test-uuid',
            created: true,
          },
          options: [
            { uuid: 'option1-test-uuid', vote_count: 2 },
            { uuid: 'option2-test-uuid', vote_count: 0 },
          ],
        },
        votes: [
          { id: 1, user: { uuid: userId } },
          { id: 2, user: { uuid: 'test-user2-uuid' } },
        ],
      };

      // mocks
      optionRepo.findDetailedOptionById = jest.fn().mockImplementation(() => {
        return Promise.resolve(optionInDB);
      });

      userRepo.findOne = jest.fn().mockResolvedValue(foundUser);

      // assertions
      expect(
        votesService.addVote('option1-test-uuid', userId),
      ).rejects.toThrowError(
        new ConflictException('User has already voted for this option'),
      );
    });

    it('should call vote.Repository.addVote with needed parameters', async () => {
      // data
      const userId = 'test-user-uuid';

      const foundUser = { uuid: userId };

      const optionInDB = {
        id: 1,
        uuid: 'option1-test-uuid',
        vote_count: 2,
        optionsGroup: {
          post: {
            created: true,
          },
          options: [
            { uuid: 'option1-test-uuid', vote_count: 2 },
            { uuid: 'option2-test-uuid', vote_count: 0 },
          ],
        },
        votes: [
          { id: 1, user: { uuid: 'test-user1-uuid' } },
          { id: 2, user: { uuid: 'test-user2-uuid' } },
        ],
      };

      const passedOption = {
        id: 1,
        uuid: 'option1-test-uuid',
        vote_count: 3,
        optionsGroup: {
          post: {
            created: true,
          },
          options: [
            { uuid: 'option1-test-uuid', vote_count: 2 },
            { uuid: 'option2-test-uuid', vote_count: 0 },
          ],
        },
      };

      // mocks
      optionRepo.findDetailedOptionById = jest.fn().mockImplementation(() => {
        return Promise.resolve(optionInDB);
      });

      voteRepo.addVote = jest.fn().mockResolvedValueOnce(undefined);

      optionRepo.incrementVoteCount = jest
        .fn()
        .mockImplementation((option: Option) => {
          option.vote_count++;
          return Promise.resolve(option);
        });

      userRepo.findOne = jest.fn().mockResolvedValue(foundUser);

      // actions
      await votesService.addVote('option1-test-uuid', userId);
      // assertions
      expect(voteRepo.addVote).toBeCalledWith(passedOption, foundUser);
    });
  });
});
