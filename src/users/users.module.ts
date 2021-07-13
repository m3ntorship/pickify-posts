import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';
import { UserRepository } from './entities/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'firebase-jwt' }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [UsersController],
  providers: [FirebaseAuthStrategy, UsersService],
  exports: [PassportModule, FirebaseAuthStrategy],
})
export class UsersModule {}
