import { EntityRepository, Repository } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Vote } from './vote.entity';
import { Option } from '../../posts/entities/option.entity';

@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {
  async addVote(optionId: string) {
    try {
      const option = await Option.findOneOrFail({
        where: { uuid: optionId },
        relations: ['optionsGroup', 'optionsGroup.options'],
      });

      const vote = new Vote();
      vote.option = option;
      await vote.save();

      option.vote_count++;
      await option.save();

      const response = option.optionsGroup.options.map((option) => {
        return { votes_count: option.vote_count, optionId: option.uuid };
      });
      return response;
    } catch (error) {
      if (error.name === 'EntityNotFound') throw new NotFoundException();
      else throw new InternalServerErrorException();
    }
  }
}
