import { ObjectLiteral } from '../interfaces/objectLiteral';

export function isUserAuthorized<T extends ObjectLiteral>(
  entity: T,
  userId: number,
): boolean {
  if (entity.user_id !== userId) {
    return false;
  }
  return true;
}
