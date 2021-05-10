import { Module } from '@nestjs/common';
import { PromModule } from '@digikare/nestjs-prom';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleExampleModule } from './moduleExample/moduleExample.module';
import { PostsModule } from './posts/posts.module';
import configuration from './config/configuration';
import config from './config/database';

const evnVariable = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      // load different .env files based on runtime environment variable
      // envFilePath: [`.${evnVariable}.env`],
      envFilePath: !evnVariable ? '.env' : `.env.${evnVariable}`,
      isGlobal: true,
      load: [configuration],
    }),
    PromModule.forRoot({
      withHttpMiddleware: {
        enable: true,
      },
    }),
    TypeOrmModule.forRoot(config),
    ModuleExampleModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
