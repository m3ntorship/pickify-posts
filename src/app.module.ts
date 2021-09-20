import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PromModule } from '@digikare/nestjs-prom';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from './media/media.module';
import { VotesModule } from './votes/votes.module';
import { PostsModule } from './posts/posts.module';
import configuration from './config/configuration';
import dbConfig from './config/database';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../openAPI/post.openAPI.json';
import { PassportModule } from '@nestjs/passport';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './logging/winston.options';
import { UsersModule } from './users/users.module';
import { ReportModule } from './report/report.module';
import { FeedBackMoudle } from './feedbacks/feedback.module';

const evnVariable = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      // load different .env files based on runtime environment variable
      envFilePath: !evnVariable ? '.development.env' : `.${evnVariable}.env`,
      isGlobal: true,
      load: [configuration],
    }),
    PromModule.forRoot({
      withHttpMiddleware: {
        enable: true,
      },
    }),
    TypeOrmModule.forRoot(dbConfig),
    WinstonModule.forRoot(winstonLoggerOptions),
    MediaModule,
    VotesModule,
    PostsModule,
    PassportModule,
    UsersModule,
    ReportModule,
    FeedBackMoudle,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  // Add swagger middleware to /api endpoint only
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(swaggerUi.serve, swaggerUi.setup(swaggerDocument))
      .exclude('/api/(.[a-z0-9-/]*)')
      .forRoutes('/');
  }
}
