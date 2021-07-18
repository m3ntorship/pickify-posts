import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../users/entities/user.repository';
import { Option } from '../posts/entities/option.entity';
import { OptionRepository } from '../posts/entities/option.repository';
import { VoteRepository } from './entities/votes.repository';
import { VotesService } from './votes.service';
import { LockedException } from '../shared/exceptions/locked.exception';
import { User } from '../users/entities/user.entity';

describe('VotesService', () => {
  let votesService: VotesService;
  let optionRepo: OptionRepository;
  let voteRepo: VoteRepository;

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
  });

  it('should be defined and have the necessarry methods', () => {
    expect(votesService).toBeDefined();
    expect(votesService).toHaveProperty('addVote');
  });

  describe('addVote method', () => {
    it('should add vote to option & return vote_count & ids of all options in the group', async () => {
      // data
      const user = { uuid: 'post-owner-user-uuid' } as User;
      const expectedResponse = [
        { votes_count: 3, optionId: 'option1-test-uuid', voted: true },
        { votes_count: 0, optionId: 'option2-test-uuid', voted: false },
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

      // assertions
      expect(votesService.addVote('option1-test-uuid', user)).resolves.toEqual(
        expectedResponse,
      );
    });

    it('should throw not found error if option not found', () => {
      // data
      const user = { uuid: 'post-owner-user-uuid' } as User;

      // mocks
      optionRepo.findDetailedOptionById = jest.fn().mockImplementation(() => {
        return Promise.resolve(undefined);
      });

      // assertions
      expect(
        votesService.addVote('option1-test-uuid', user),
      ).rejects.toThrowError(
        new NotFoundException('Option with id:option1-test-uuid not found'),
      );
    });

    it('should throw locked error if post is not ready yet', () => {
      // data
      const user = { uuid: 'test-user-uuid' } as User;
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
      expect(votesService.addVote(optionId, user)).rejects.toThrowError(
        new LockedException(
          `Post:${optionInDB.optionsGroup.post.uuid} with option:${optionId} still under creation...`,
        ),
      );
    });

    it('should throw locked error if user tries to vote on his own post', () => {
      // data
      const user = { uuid: 'post-owner-user-uuid' } as User;
      const optionId = `option-test-uuid`;
      const optionInDB = {
        id: 1,
        uuid: optionId,
        vote_count: 2,
        optionsGroup: {
          post: {
            ready: true,
            user: { uuid: user.uuid },
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
      expect(votesService.addVote(optionId, user)).rejects.toThrowError(
        new BadRequestException(`You cannot vote on your own post`),
      );
    });

    it('should throw conflict error if user voted before in any option in one group', () => {
      // data
      const user = { uuid: 'test-user-uuid' } as User;
      const optionId = `option-test-uuid`;
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
                { user: { uuid: user.uuid } },
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
      expect(votesService.addVote(optionId, user)).rejects.toThrowError(
        new ConflictException(
          `User has already voted for option with id:${optionInDB.uuid}`,
        ),
      );
    });

    it('should call vote.Repository.addVote with needed parameters', async () => {
      // data
      const optionId = `option-test-uuid`;
      const user = { uuid: 'test-user-uuid' } as User;

      const foundUser = { uuid: user.uuid };

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

      // actions
      await votesService.addVote('option1-test-uuid', user);
      // assertions
      expect(voteRepo.addVote).toBeCalledWith(optionInDB, foundUser);
    });
  });
});
