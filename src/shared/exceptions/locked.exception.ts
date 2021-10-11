import { HttpException } from '@nestjs/common';
import { pickifyHttpStatus } from '../enums/pickifyHttpStatus.enum';

export class LockedException extends HttpException {
  constructor(message: string) {
    super(message || 'Locked', pickifyHttpStatus.LOCKED);
  }
}
