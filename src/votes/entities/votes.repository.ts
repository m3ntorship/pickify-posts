import { Option } from '../../posts/entities/option.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Vote } from './vote.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OptiosnGroup } from 'src/posts/entities/optionsGroup.entity';

@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {
  async addVote(optionId: string) {
    try {
      const option = await Option.findOneOrFail({ where: { uuid: optionId } });

      const vote = new Vote();
      vote.option = option;
      await vote.save();

      option.votes.push(vote);
      option.vote_count++;
      await option.save();
    } catch (error) {
      if (error) throw new NotFoundException();
      else throw new InternalServerErrorException();
    }
  }
}
