import { EntityRepository, getRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async getByGoogleId(googleId: string): Promise<User> {
    return await this.createQueryBuilder('user')
      .where('user.google_id = :id', { id: googleId })
      .getOne();
  }

  public async createUser(user: any): Promise<User> {
    const userToFind = await this.getByGoogleId(user.user_id);
    if (userToFind) {
      return userToFind;
    }

    const newUser = this.create();
    newUser.name = user.name;
    newUser.profile_pic = user.picture;
    newUser.google_id = user.user_id;
    return await this.save(newUser);
  }
}
