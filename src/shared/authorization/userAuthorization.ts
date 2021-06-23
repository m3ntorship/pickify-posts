import { ObjectLiteral } from '../interfaces/objectLiteral';

export function isUserAuthorized<T extends ObjectLiteral>(
  entity: T,
  userId: string,
): boolean {
  if (entity.user.uuid !== userId) {
    return false;
  }
  return true;
}
