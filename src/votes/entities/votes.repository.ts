import { EntityRepository, Repository } from 'typeorm';
import {
  HttpStatus,
  HttpException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Vote } from './vote.entity';
import { Option } from '../../posts/entities/option.entity';
import { OptionsVotes } from '../interfaces/optionsVotes.interface';

@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {
  async addVote(optionId: string, userId: number): Promise<OptionsVotes[]> {
    const option = await Option.findOne({
      where: { uuid: optionId },
      relations: [
        'votes',
        'optionsGroup',
        'optionsGroup.options',
        'optionsGroup.post',
      ],
    });

    // if option not found
    if (!option)
      throw new NotFoundException(`Option with id:${optionId} not found`);

    // if post of option still under creation
    if (!option.optionsGroup.post.created)
      throw new HttpException(
        `Post:${option.optionsGroup.post.uuid} with option:${optionId} still under creation...`,
        423,
      );

    // check if user has voted for this option before
    const isUserVoted = option.votes.some((vote) => vote.user_id === userId);
    if (isUserVoted) {
      throw new ConflictException('User has already voted for this option');
    }

    // Create vote and save it in DB
    const vote = this.create();
    vote.option = option;
    vote.user_id = userId;
    await vote.save();

    // increment the vote count in the option
    option.vote_count++;
    await option.save();

    const response = option.optionsGroup.options.map((option) => {
      if (option.uuid === optionId) option.vote_count++;
      return { votes_count: option.vote_count, optionId: option.uuid };
    });
    return response;
  }
}
