import { Request } from 'express';
import { User } from '../../users/entities/user.entity';

export interface ExtendedRequest extends Request {
  user: User;
}
