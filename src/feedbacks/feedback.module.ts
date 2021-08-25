import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackRepository } from './entities/feedback.repository';
import { FeedBackController } from './feedback.controller';
import { FeedBackService } from './feedback.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackRepository])],
  controllers: [FeedBackController],
  providers: [FeedBackService],
})
export class FeedBackMoudle {}
