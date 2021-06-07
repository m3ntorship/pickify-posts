import { Controller, Param, Put } from '@nestjs/common';
import { OptionIdParam } from '../shared/validations/uuid.validator';
import { VotesService } from './votes.service';
import { OptionsVotes } from './interfaces/optionsVotes.interface';

@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Put('/:optionid')
  addVote(@Param() params: OptionIdParam): Promise<OptionsVotes[]> {
    return this.votesService.addVote(params.optionid);
  }
}
