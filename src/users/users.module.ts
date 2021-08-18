import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';
import { UserRepository } from './entities/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAuthGuard } from '../shared/Guards/firebase-auth.guard';
import { PostRepository } from 'src/posts/entities/post.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'firebase-jwt' }),
    TypeOrmModule.forFeature([UserRepository, PostRepository]),
  ],
  controllers: [UsersController],
  providers: [
    FirebaseAuthStrategy,
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
  ],
  exports: [PassportModule, FirebaseAuthStrategy],
})
export class UsersModule {}
