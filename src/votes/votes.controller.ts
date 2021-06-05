import { Controller, Param, Put } from '@nestjs/common';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Put('/:optionid')
  addVote(@Param('optionid') optionId: string) {
    return this.votesService.addVote(optionId);
  }
}
