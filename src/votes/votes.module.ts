import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionRepository } from 'src/posts/entities/option.repository';
import { VoteRepository } from './entities/votes.repository';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';

@Module({
  imports: [TypeOrmModule.forFeature([VoteRepository, OptionRepository])],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
