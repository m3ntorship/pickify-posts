import { EntityRepository, Repository } from 'typeorm';
import { Vote } from './vote.entity';
import { Option } from '../../posts/entities/option.entity';

@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {
  async addVote(option: Option, userId: number): Promise<void> {
    // Create vote and save it in DB
    const vote = this.create();
    vote.option = option;
    vote.user_id = userId;
    await this.save(vote);
  }
}
