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
            createPost: jest.fn().mockResolvedValue({ uuid: 'test id' }),
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
    expect(repo).toBeDefined();
    expect(repo).toHaveProperty('createPost');
  });

  describe('createPost method', () => {
    it('should return object with id', async () => {
      const dto: PostCreationDto = {
        type: 'text_poll',
        caption: 'test caption',
        is_hidden: false,
      };
      const data = await service.createPost(dto);

      expect(data).toEqual({ id: 'test id' });

      expect(repo.createPost).toBeCalledWith(dto);
      expect(repo.createPost).toBeCalledTimes(1);
    });
  });
});
