import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
// import { UsersModule } from '../users/users.module';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';

@Module({
  imports: [
    // UsersModule,
    PassportModule.register({ defaultStrategy: 'firebase-jwt' }),
  ],
  controllers: [],
  providers: [FirebaseAuthStrategy],
  exports: [PassportModule, FirebaseAuthStrategy],
})
export class AuthModule {}
