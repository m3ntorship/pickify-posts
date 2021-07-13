import { HttpStatus } from '@nestjs/common';

export const pickifyHttpStatus = {
  ...HttpStatus,
  LOCKED: 423,
};
