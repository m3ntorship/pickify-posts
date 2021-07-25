import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller).toHaveProperty('createUser');
  });

  describe('createUser Method', () => {
    it('should return user from request body', () => {
      // data
      const req = {
        user: 'test',
      };

      // actions
      const res = controller.createUser(req);
      // assertion
      expect(res).toEqual(req.user);
    });
  });
});
