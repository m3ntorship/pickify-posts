import { Injectable, Request } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './entities/user.repository';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private fireBaseAuthStrategy: FirebaseAuthStrategy,
  ) {}

  async createUser(@Request() req): Promise<any> {
    return this.userRepository.createUser(req.user);
  }
}
