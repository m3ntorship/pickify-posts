import {
  BadRequestException,
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
import { LockedException } from '../shared/exceptions/locked.exception';

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
      const userId = 'post-owner-user-uuid';
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
            ready: true,
            user: { uuid: 'test-user1-uuid' },
          },
          options: [
            {
              uuid: 'option1-test-uuid',
              vote_count: 2,
              votes: [
                { user: { uuid: 'test-user4-uuid' } },
                { user: { uuid: 'test-user5-uuid' } },
              ],
            },
            { uuid: 'option2-test-uuid', vote_count: 0, votes: [] },
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

    it('should throw locked error if post is not ready yet', () => {
      // data
      const userId = 'test-user-uuid';
      const optionId = `option-test-uuid`;
      const optionInDB = {
        id: 1,
        uuid: optionId,
        vote_count: 2,
        optionsGroup: {
          post: {
            ready: false,
            user: { uuid: 'test-user1-uuid' },
            uuid: 'test-post-uuid',
          },
          options: [
            {
              uuid: 'option1-test-uuid',
              vote_count: 2,
              votes: [
                { user: { uuid: 'test-user4-uuid' } },
                { user: { uuid: 'test-user5-uuid' } },
              ],
            },
            { uuid: 'option2-test-uuid', vote_count: 0, votes: [] },
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

      // assertions
      expect(votesService.addVote(optionId, userId)).rejects.toThrowError(
        new LockedException(
          `Post:${optionInDB.optionsGroup.post.uuid} with option:${optionId} still under creation...`,
        ),
      );
    });

    it('should throw locked error if user tries to vote on his own post', () => {
      // data
      const userId = 'test-user-uuid';
      const optionId = `option-test-uuid`;
      const optionInDB = {
        id: 1,
        uuid: optionId,
        vote_count: 2,
        optionsGroup: {
          post: {
            ready: true,
            user: { uuid: userId },
            uuid: 'test-post-uuid',
          },
          options: [
            {
              uuid: 'option1-test-uuid',
              vote_count: 2,
              votes: [
                { user: { uuid: 'test-user4-uuid' } },
                { user: { uuid: 'test-user5-uuid' } },
              ],
            },
            { uuid: 'option2-test-uuid', vote_count: 0, votes: [] },
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

      // assertions
      expect(votesService.addVote(optionId, userId)).rejects.toThrowError(
        new BadRequestException(`You cannot vote on your own post`),
      );
    });

    it('should throw conflict error if user voted before in any option in one group', () => {
      // data
      const userId = 'test-user-uuid';
      const optionId = `option-test-uuid`;
      const foundUser = { uuid: userId };
      const optionInDB = {
        id: 1,
        uuid: optionId,
        vote_count: 2,
        optionsGroup: {
          post: {
            ready: true,
            user: { uuid: 'test-user1-uuid' },
            uuid: 'test-post-uuid',
          },
          options: [
            {
              uuid: optionId,
              vote_count: 2,
              votes: [
                { user: { uuid: userId } },
                { user: { uuid: 'test-user5-uuid' } },
              ],
            },
            { uuid: 'option2-test-uuid', vote_count: 0, votes: [] },
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

      userRepo.findOne = jest.fn().mockResolvedValue(foundUser);

      // assertions
      expect(votesService.addVote(optionId, userId)).rejects.toThrowError(
        new ConflictException(
          `User has already voted for option with id:${optionInDB.uuid}`,
        ),
      );
    });

    it('should call vote.Repository.addVote with needed parameters', async () => {
      // data
      const optionId = `option-test-uuid`;
      const userId = 'test-user-uuid';

      const foundUser = { uuid: userId };

      const optionInDB = {
        id: 1,
        uuid: optionId,
        vote_count: 2,
        optionsGroup: {
          post: {
            ready: true,
            user: { uuid: 'test-user1-uuid' },
            uuid: 'test-post-uuid',
          },
          options: [
            {
              uuid: 'test-option3-uuid',
              vote_count: 2,
              votes: [
                { user: { uuid: 'test-user6-uuid' } },
                { user: { uuid: 'test-user5-uuid' } },
              ],
            },
            { uuid: 'option2-test-uuid', vote_count: 0, votes: [] },
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

      // actions
      await votesService.addVote('option1-test-uuid', userId);
      // assertions
      expect(voteRepo.addVote).toBeCalledWith(optionInDB, foundUser);
    });
  });
});
