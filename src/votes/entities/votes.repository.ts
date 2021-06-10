import { EntityRepository, Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Vote } from './vote.entity';
import { Option } from '../../posts/entities/option.entity';
import { OptionsVotes } from '../interfaces/optionsVotes.interface';

@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {
  async addVote(optionId: string): Promise<OptionsVotes[]> {
    const option = await Option.findOne({
      where: { uuid: optionId },
      relations: ['optionsGroup', 'optionsGroup.options', 'optionsGroup.post'],
    });

    // if option not found
    if (!option)
      throw new NotFoundException('cannot find option entity with this id');

    // if post of option still under creation
    if (!option.optionsGroup.post.created)
      throw new BadRequestException('Post still under creation...');

    const vote = this.create();
    vote.option = option;
    await vote.save();

    option.vote_count++;
    await option.save();

    const response = option.optionsGroup.options.map((option) => {
      if (option.uuid === optionId) option.vote_count++;
      return { votes_count: option.vote_count, optionId: option.uuid };
    });
    return response;
  }
}
