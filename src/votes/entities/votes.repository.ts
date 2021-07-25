import { EntityRepository, Repository } from 'typeorm';
import { Vote } from './vote.entity';
import { Option } from '../../posts/entities/option.entity';
import { User } from '../../users/entities/user.entity';

@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {
  async addVote(option: Option, user: User): Promise<void> {
    // Create vote and save it in DB
    const vote = this.create();
    vote.option = option;
    vote.user = user;
    await this.save(vote);
  }
}
