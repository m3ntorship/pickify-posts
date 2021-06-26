import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LockedException } from '../shared/exceptions/locked.exception';
import { OptionRepository } from '../posts/entities/option.repository';
import { VoteRepository } from './entities/votes.repository';
import { OptionsVotes } from './interfaces/optionsVotes.interface';
import { UserRepository } from '../posts/entities/user.repository';

@Injectable()
export class VotesService {
  constructor(
    private voteRepository: VoteRepository,
    private optionRepository: OptionRepository,
    private userRepository: UserRepository,
  ) {}
  async addVote(optionId: string, userId: string): Promise<OptionsVotes[]> {
    // get the option with relation to vote, group & post
    let option = await this.optionRepository.findDetailedOptionById(optionId);

    // if option not found
    if (!option) {
      throw new NotFoundException(`Option with id:${optionId} not found`);
    }
    // if post of option still under creation
    if (!option.optionsGroup.post.created) {
      throw new LockedException(
        `Post:${option.optionsGroup.post.uuid} with option:${optionId} still under creation...`,
      );
    }

    // check if user has voted for this option before
    const isUserVoted = option.votes.some((vote) => vote.user.uuid === userId);
    if (isUserVoted) {
      throw new ConflictException('User has already voted for this option');
    }

    // delete votes from option
    // as it cuase error when adding option to a vote in voteRepository.addVote
    delete option.votes;

    // get user so we can relate it when adding a vote
    const user = await this.userRepository.findOne({ where: { uuid: userId } });

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
        optionId: currOption.uuid,
      };
    });
  }
}
