import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LockedException } from '../shared/exceptions/locked.exception';
import { Option } from '../posts/entities/option.entity';
import { OptionRepository } from '../posts/entities/option.repository';
import { Vote } from './entities/vote.entity';
import { VoteRepository } from './entities/votes.repository';
import { OptionsVotes } from './interfaces/optionsVotes.interface';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote) private voteRepository: VoteRepository,
    @InjectRepository(Option) private optionRepository: OptionRepository,
  ) {}
  async addVote(optionId: string, userId: number): Promise<OptionsVotes[]> {
    // get the option with relation to vote, group & post
    let option = await this.optionRepository.findOptionById(optionId);

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
    const isUserVoted = option.votes.some((vote) => vote.user_id === userId);
    if (isUserVoted) {
      throw new ConflictException('User has already voted for this option');
    }

    // delete votes from option
    // as it cuase error when adding option to a vote in voteRepository.addVote
    delete option.votes;

    // add vote
    await this.voteRepository.addVote(option, userId);

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
