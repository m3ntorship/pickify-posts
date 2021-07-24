import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LockedException } from '../shared/exceptions/locked.exception';
import { OptionRepository } from '../posts/entities/option.repository';
import { VoteRepository } from './entities/votes.repository';
import { OptionsVotes } from './interfaces/optionsVotes.interface';
import { UserRepository } from '../users/entities/user.repository';
import { User } from '../users/entities/user.entity';

@Injectable()
export class VotesService {
  constructor(
    private voteRepository: VoteRepository,
    private optionRepository: OptionRepository,
    private userRepository: UserRepository,
  ) {}
  async addVote(optionId: string, user: User): Promise<OptionsVotes[]> {
    // get the option with relation to vote, group & post
    let option = await this.optionRepository.findDetailedOptionById(optionId);

    // if option not found
    if (!option) {
      throw new NotFoundException(`Option with id:${optionId} not found`);
    }
    // if post of option still not ready
    if (!option.optionsGroup.post.ready) {
      throw new LockedException(
        `Post:${option.optionsGroup.post.uuid} with option:${optionId} still under creation...`,
      );
    }

    // prevent post owner from voting
    if (option.optionsGroup.post.user.uuid == user.uuid) {
      throw new BadRequestException(`You cannot vote on your own post`);
    }

    // prevent user from voting twice on any option inside the group
    let isUserVoted = false;
    option.optionsGroup.options.forEach((option) => {
      isUserVoted = option.votes.some((vote) => vote.user.uuid === user.uuid);
      if (isUserVoted) {
        throw new ConflictException(
          `User has already voted for option with id:${option.uuid}`,
        );
      }
    });

    // delete votes from option
    // as it cuase error when adding option to a vote in voteRepository.addVote
    delete option.votes;

    // add vote
    await this.voteRepository.addVote(option, user);

    // Increment vote_count in option entity
    option = await this.optionRepository.incrementVoteCount(option);

    // return all options of the group with their vote_count & id
    return option.optionsGroup.options.map((currOption) => {
      return {
        votes_count:
          currOption.uuid === optionId
            ? option.vote_count
            : currOption.vote_count,
        voted: currOption.uuid === optionId ? true : false,
        optionId: currOption.uuid,
      };
    });
  }
}
