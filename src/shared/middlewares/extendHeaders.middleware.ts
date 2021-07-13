// THIS IS TEMPORARY FILE AND SHOULD BE REMOVED AND REPLACED BY REAL IMPLEMENTATION FOR AUTHENTICATION

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
// middleware to add the authorization to reqest,
// so, authorization can be extracted in a controller with @Headers() decorator

const USERS = [
  '3ad4e0f5-1787-46fa-851f-d7dddbfaf2c3',
  '9a8f172b-9496-4726-b2ad-e42200168ee9',
  '9e7ecc64-a563-4cbe-a69b-c99a569b41b9',
  '9e12c68c-8079-4a3b-a327-20be3d2e5ae8',
  '6c1f812c-2fca-4c05-8cec-2a9eb56c35d0',
];

const isValidUser = (id) => {
  return USERS.some((user) => user === id);
};
@Injectable()
export class ExtendHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('No user id');
    }
    const userId = req.headers.authorization.split(' ')[1];
    if (!isValidUser(userId)) {
      throw new UnauthorizedException(
        `Unauthorization. Use one of the following ids: ${USERS}`,
      );
    }
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
