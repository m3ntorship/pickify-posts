import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
// middleware to add the authorization to reqest,
// so, authorization can be extracted in a controller with @Headers() decorator
@Injectable()
export class ExtendHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers.authorization.split(' ')[1];
    // check if authorization is sent on form 'Bearer X' where X is number
    if (req.headers.authorization.startsWith('Bearer ') && +userId)
      req.headers = {
        ...req.headers,
        Authorization: userId,
      };
    next();
  }
}
