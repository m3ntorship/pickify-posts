import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/entities/user.repository';
import { PostRepository } from '../posts/entities/post.repository';
import { PostsReportRepository } from './entities/report.repository';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsReportRepository,
      PostRepository,
      UserRepository,
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
