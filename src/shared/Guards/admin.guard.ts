import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminAuthGuard extends AuthGuard('firebase-jwt') {
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
    const emails = [
      'omarsamy09@gmail.com',
      'mohamed43628@gmail.com',
      'm3ntorship.com@gmail.com',
      'ogmal01@gmail.com',
      'ahmedelsayad98@gmail.com',
      'ahmedadel555441@gmail.com',
      'ahmedkhitaby@gmail.com',
      'mohamedalymahmoudmorsy@gmail.com',
    ];

    const result = emails.find((email) => email === user.email);

    if (result == null) {
      throw new ForbiddenException();
    }
  }
}
