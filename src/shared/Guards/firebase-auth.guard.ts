import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/entities/user.repository';

@Injectable()
export class FirebaseAuthGuard extends AuthGuard('firebase-jwt') {
  constructor(private userRepo: UserRepository) {
    super();
  }

  private async getUser(user: any): Promise<User> {
    return await this.userRepo.checkUser(user);
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const user = await this.getUser(context['args'][0].user);
    if (!user) {
      throw new UnauthorizedException('Unauthorized User');
    }
    return super.canActivate(context);
  }
}
