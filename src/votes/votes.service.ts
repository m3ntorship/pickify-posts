import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { VoteRepository } from './entities/votes.repository';
import { OptionsVotes } from './interfaces/optionsVotes.interface';

@Injectable()
export class VotesService {
  constructor(@InjectRepository(Vote) private voteRepository: VoteRepository) {}
  addVote(optionId: string, userId: number): Promise<OptionsVotes[]> {
    return this.voteRepository.addVote(optionId, userId);
  }
}
