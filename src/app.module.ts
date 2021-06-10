import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PromModule } from '@digikare/nestjs-prom';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from './media/media.module';
import { VotesModule } from './votes/votes.module';
import { PostsModule } from './posts/posts.module';
import configuration from './config/configuration';
import {} from 'path-to-regexp';
import config from './config/database';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../openAPI/post.openAPI.json';
import { ExtendHeadersMiddleware } from './shared/middlewares/extendHeaders.middleware';

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
    TypeOrmModule.forRoot(config),
    MediaModule,
    VotesModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  // Add swagger middleware to /api endpoint only
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExtendHeadersMiddleware).forRoutes('/');
    consumer
      .apply(swaggerUi.serve, swaggerUi.setup(swaggerDocument))
      .exclude('/api/(.[a-z0-9-/]*)')
      .forRoutes('/');
  }
}
