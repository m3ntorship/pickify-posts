import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import admin from 'firebase-admin';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token) {
    try {
      const user = await admin.auth().verifyIdToken(token, true);
      return user;
    } catch (error) {
      return this.staticIdAuth(token);
    }
  }
  private staticIdAuth(uuid: string): boolean {
    // Add logic later
    if (!uuid) {
      throw new UnauthorizedException('No user id');
    }
    return true;
  }
}
