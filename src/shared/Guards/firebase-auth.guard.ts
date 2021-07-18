import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRepository } from '../../users/entities/user.repository';

@Injectable()
export class FirebaseAuthGuard extends AuthGuard('firebase-jwt') {
  constructor(private userRepo: UserRepository) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    // whenever the below line runs, it calls validate method inside firebase-auth.strategy
    return await super.canActivate(context);
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): any {
    const handleFn = async () => {
      let foundUser;
      const url = context.getArgByIndex(0).url;

      if (url === '/api/users/register') {
        foundUser = await this.userRepo.createUser(user);
      } else {
        // remove the below if when front-end implements authentication with firebase
        if (user.name === 'temp') {
          foundUser = await this.userRepo.findOne({
            where: { uuid: user.uuid },
          });
        } else {
          foundUser = await this.userRepo.getByGoogleId(user.user_id);
          if (!foundUser) {
            throw new UnauthorizedException('Unauthorized');
          }
          return foundUser;
        }
      }

      return foundUser;
    };

    return handleFn();
  }
}
