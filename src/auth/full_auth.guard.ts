import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FullAuthGuard extends AuthGuard('firebase-jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Calling (canActivate) function of the original (AuthGuard)
      // So that the original functionality is preserved
      // that is: calling (validate) function of (FirebaseAuthStrategy) class
      await super.canActivate(context);

      return true;
    } catch (error) {
      // This executes in case firebase's (verifyIdToken) throws
      // meaning authentication using firebase idToken failed

      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      return this.staticIdAuth(authHeader);
    }
  }
  private staticIdAuth(authHeader: string): boolean {
    // Add logic later
    if (!authHeader) {
      throw new UnauthorizedException('No user id');
    }
    return true;
  }
}
