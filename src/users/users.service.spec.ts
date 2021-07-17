import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';
import { UserRepository } from './entities/user.repository';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let userService: UsersService;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UserRepository, FirebaseAuthStrategy],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userService).toHaveProperty('createUser');
  });
});
