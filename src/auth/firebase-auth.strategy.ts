import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(
          path.join(
            __dirname,
            '..',
            '..',
            '..',
            'firebase_service_account.json',
          ),
        ),
        databaseURL: 'https://pick-291910.firebaseio.com',
      });
      const user = await admin.auth().verifyIdToken(token, true);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
