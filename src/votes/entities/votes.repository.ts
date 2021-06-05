import { Option } from '../../posts/entities/option.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Vote } from './vote.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {
  async addVote(optionId: string) {
    try {
      const option = await Option.findOneOrFail({ where: { uuid: optionId } });

      const vote = new Vote();
      vote.option = option;
      await vote.save();

      option.vote_count++;
      await option.save();
    } catch (error) {
      console.log(error);
      if (error.name === 'EntityNotFound') throw new NotFoundException();
      else throw new InternalServerErrorException();
    }
  }
}
