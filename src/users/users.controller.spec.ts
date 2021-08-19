import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../posts/posts.service';
import { PostRepository } from '../posts/entities/post.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './entities/user.repository';
import { OptionsGroupRepository } from '../posts/entities/optionsGroup.repository';
import { OptionRepository } from '../posts/entities/option.repository';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        PostRepository,
        PostsService,
        UserRepository,
        OptionsGroupRepository,
        OptionRepository,
      ],
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
