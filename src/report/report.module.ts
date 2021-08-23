import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackRepository } from './entities/feedback.repository';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackRepository])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
