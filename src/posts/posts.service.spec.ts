import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PostRepository } from './entities/postRepository';
import { PostIdParam } from '../validations/postIdParam.validator';

describe('PostsService', () => {
  let service: PostsService;
  let repo: PostRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostRepository,
          useValue: { flagPostCreation: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repo = module.get<PostRepository>(PostRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have flagPost method', () => {
    expect(service).toHaveProperty('flagPost');
  });

  describe('flagPost method', () => {
    it('should call postRepository.flagPost with dto & postid', async () => {
      const dto = { finished: true };
      const params = new PostIdParam();
      await service.flagPost(params, dto);
      expect(repo.flagPostCreation).toBeCalledWith(dto.finished, params.postid);
    });
  });
});
