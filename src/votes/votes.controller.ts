import {
  Controller,
  Param,
  Put,
  UseFilters,
  Headers,
  Request,
} from '@nestjs/common';
import { OptionIdParam } from '../shared/validations/uuid.validator';
import { VotesService } from './votes.service';
import { OptionsVotes } from './interfaces/optionsVotes.interface';
import { ValidationExceptionFilter } from '../shared/exception-filters/validation-exception.filter';
import * as winston from 'winston';
import { winstonLoggerOptions } from '../logging/winston.options';
import { ExtendedRequest } from 'src/shared/interfaces/expressRequest';

@Controller('votes')
@UseFilters(
  new ValidationExceptionFilter(winston.createLogger(winstonLoggerOptions)),
)
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Put('/:optionid')
  addVote(
    @Param() params: OptionIdParam,
    @Request() req: ExtendedRequest,
  ): Promise<OptionsVotes[]> {
    return this.votesService.addVote(params.optionid, req.user);
  }
}
