import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionRepository } from '../posts/entities/option.repository';
import { OptionsGroupRepository } from '../posts/entities/optionsGroup.repository';
import { PostsService } from '../posts/posts.service';
import { UserRepository } from '../users/entities/user.repository';
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
      OptionRepository,
      OptionsGroupRepository,
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService, PostsService],
})
export class ReportModule {}
