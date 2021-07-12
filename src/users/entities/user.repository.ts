import { EntityRepository, getRepository, Repository } from 'typeorm';
import { UserCreationDto } from '../dto/userCreation.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async createUser(user: any): Promise<User> {
    const userToFind = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.user_id = :id', { id: user.user_id })
      .getOne();

    if (userToFind) {
      return userToFind;
    }
    console.log(user.user_id);
    const newUser = new User();
    console.log(newUser);
    newUser.name = user.name;
    newUser.profile_pic = user.picture;
    newUser.user_id = user.user_id;
    console.log(newUser);
    return await newUser.save();
  }
}
