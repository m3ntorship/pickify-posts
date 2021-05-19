import { Controller, NotImplementedException, Put } from '@nestjs/common';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Put('/:optionid')
  addVote() {
    throw new NotImplementedException();
  }
}
