import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionRepository } from 'src/posts/entities/option.repository';
import { UserRepository } from 'src/posts/entities/user.repository';
import { VoteRepository } from './entities/votes.repository';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VoteRepository,
      OptionRepository,
      UserRepository,
    ]),
  ],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
