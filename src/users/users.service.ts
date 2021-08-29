import { Injectable } from '@nestjs/common';
import { UserRepository } from './entities/user.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}
  //Reset daily reports count on daily basis
  dailyReportsCount = setInterval(async () => {
    const users = await this.userRepository.find();
    const numUsers = users.length;
    let i = 0;
    while (i < numUsers) {
      users[i].dailyReportsCount = 0;
      await this.userRepository.save(users[i]);
      i++;
    }
  }, 24 * 60 * 60 * 1000);
}
