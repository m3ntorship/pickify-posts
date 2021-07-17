import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import admin from 'firebase-admin';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './entities/user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepo: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token) {
    try {
      const user = await admin.auth().verifyIdToken(token, true);
      return user;
    } catch (err) {
      return this.staticIdAuth(token);
    }
  }

  private async staticIdAuth(uuid: string): Promise<User> {
    try {
      const userToFind = await this.userRepo.checkUuid(uuid);
      return userToFind;
    } catch (err) {
      throw new UnauthorizedException('Unauthorized User');
    }
  }
}
