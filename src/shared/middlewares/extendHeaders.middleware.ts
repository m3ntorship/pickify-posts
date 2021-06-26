// THIS IS TEMPORARY FILE AND SHOULD BE REMOVED AND REPLACED BY REAL IMPLEMENTATION FOR AUTHENTICATION

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
// middleware to add the authorization to reqest,
// so, authorization can be extracted in a controller with @Headers() decorator
@Injectable()
export class ExtendHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('No user id');
    }
    const userId = req.headers.authorization.split(' ')[1];
    // check if authorization is sent on form 'Bearer X'
    if (req.headers.authorization.startsWith('Bearer ')) {
      req.headers = {
        ...req.headers,
        Authorization: userId,
      };
    } else {
      throw new UnauthorizedException('no authorization headers');
    }

    next();
  }
}
