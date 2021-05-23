import { Test, TestingModule } from '@nestjs/testing';
import { PostRepository } from './entities/post.repository';
import { PostsService } from './posts.service';
import { PostCreationDto } from './dto/postCreation.dto';

describe('PostsService', () => {
  let service: PostsService;
  let repo: PostRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostRepository,
          useValue: {
            createPost: jest.fn().mockResolvedValueOnce({ uuid: 'test id' }),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repo = module.get<PostRepository>(PostRepository);
  });

  it('should be defined & have the necessary methods', () => {
    expect(service).toBeDefined();
    expect(service).toHaveProperty('createPost');
  });

  describe('createPost Fn', () => {
    it('should return object with id', async () => {
      const dto: PostCreationDto = {
        type: 'text_poll',
        caption: 'test caption',
        is_hidden: false,
      };
      const data = await service.createPost(dto);
      expect.assertions(2);
      expect(repo.createPost).toBeCalledWith(dto);
      expect(data).toEqual({ id: 'test id' });
    });
  });
});
