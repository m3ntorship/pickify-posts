import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';
import { UserRepository } from './entities/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAuthGuard } from '../shared/Guards/firebase-auth.guard';
import { PostRepository } from 'src/posts/entities/post.repository';
import { UsersService } from './users.service';
import { PostsService } from 'src/posts/posts.service';
import { OptionRepository } from 'src/posts/entities/option.repository';
import { OptionsGroupRepository } from 'src/posts/entities/optionsGroup.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'firebase-jwt' }),
    TypeOrmModule.forFeature([
      UserRepository,
      PostRepository,
      OptionsGroupRepository,
      OptionRepository,
    ]),
  ],
  controllers: [UsersController],
  providers: [
    FirebaseAuthStrategy,
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
    UsersService,
    PostsService,
  ],
  exports: [PassportModule, FirebaseAuthStrategy],
})
export class UsersModule {}
