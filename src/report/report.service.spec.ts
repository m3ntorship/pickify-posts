import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { PostRepository } from '../posts/entities/post.repository';
import { UserRepository } from '../users/entities/user.repository';
import { CreatePostsReportDTO } from './dto/createReport.dto';
import { PostsReportRepository } from './entities/report.repository';
import { ReportService } from './report.service';
import { Post } from 'src/posts/entities/post.entity';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

describe('ReportService', () => {
  const postsReportRepository = {
    createPostsReport: jest.fn(),
    getUserReportsCount: jest.fn(),
  };
  const postRepository = {
    findOne: jest.fn(),

    getPostsReports: jest.fn(),
  };
  const userRepositoy = {
    save: jest.fn().mockResolvedValue(undefined),
  };
  let service: ReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: PostsReportRepository, useValue: postsReportRepository },
        { provide: PostRepository, useValue: postRepository },
        { provide: UserRepository, useValue: userRepositoy },
        ReportService,
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
  });

  it('should be defined & have the necessary methods', () => {
    expect(service).toBeDefined();
    expect(service).toHaveProperty('modifyReportedPost');
    expect(service).toHaveProperty('modifyReturnedReports');
    expect(service).toHaveProperty('createPostsReport');
    expect(service).toHaveProperty('getAllPostsReports');
  });
  describe('Create Report', () => {
    it('should create Report', async () => {
      //data
      const Dto: CreatePostsReportDTO = {
        postId: 'post-uuid',
        reportType: 'Report-type',
      };

      const reporter: User = {
        uuid: 'test-user-uuid',
      } as User;

      //mocks
      postRepository.findOne.mockResolvedValue({ uuid: 'post-uuid' } as Post);
      postsReportRepository.getUserReportsCount.mockResolvedValue(5);
      postsReportRepository.createPostsReport.mockResolvedValue(undefined);

      //actions
      const result = await service.createPostsReport(Dto, reporter);

      // assertions
      expect(postRepository.findOne).toBeCalled();
      expect(result).toBeUndefined();
    });

    it('should throw error if reported post not exist', async () => {
      //data
      const Dto: CreatePostsReportDTO = {
        postId: 'post-uuid',
        reportType: 'Report-type',
      };

      const reporter: User = {
        uuid: 'test-user-uuid',
      } as User;
      //mocks
      postRepository.findOne = jest.fn().mockResolvedValue(undefined);

      //actions

      // assertions
      await expect(
        service.createPostsReport(Dto, reporter),
      ).rejects.toThrowError(new NotFoundException('Post not found'));
    });

    it('should throw error if user reports count reached 50', async () => {
      //data
      const Dto: CreatePostsReportDTO = {
        postId: 'post-uuid',
        reportType: 'Report-type',
      };

      const reporter: User = {
        uuid: 'test-user-uuid',
      } as User;

      //mocks

      postRepository.findOne = jest
        .fn()
        .mockResolvedValue({ uuid: 'post-uuid' } as Post);
      postsReportRepository.getUserReportsCount.mockResolvedValue(50);

      // assertions
      await expect(
        service.createPostsReport(Dto, reporter),
      ).rejects.toThrowError(
        new HttpException(
          {
            message: 'Reporter can only report 50 posts per day',
          },
          HttpStatus.TOO_MANY_REQUESTS,
        ),
      );
    });
    it('shoud throw error if reporting post twice', async () => {
      //data
      const Dto: CreatePostsReportDTO = {
        postId: 'post-uuid',
        reportType: 'Report-type',
      };

      const reporter: User = {
        uuid: 'test-user-uuid',
      } as User;
      //mocks
      postsReportRepository.getUserReportsCount.mockResolvedValue(5);
      postsReportRepository.createPostsReport = jest.fn().mockRejectedValue(
        new HttpException(
          {
            message: "Reporter can't report same post twice",
          },
          HttpStatus.CONFLICT,
        ),
      );
      //actions

      // assertions
      await expect(
        service.createPostsReport(Dto, reporter),
      ).rejects.toThrowError(
        new HttpException(
          {
            message: "Reporter can't report same post twice",
          },
          HttpStatus.CONFLICT,
        ),
      );
    });
  });
  describe('Get All posts reports', () => {
    it('should return each reported posts, each post with its reports', async () => {
      //data
      const dbResult = [
        {
          uuid: 'post-uuid',
          caption: 'post-caption',
          type: 'post-type',
          postsReports: [
            {
              uuid: 'report-uuid',
              reporter: {
                uuid: 'reporter-uuid',
                name: 'reporter-name',
              },
            },
          ],
        },
      ];
      const reportedPosts = [
        {
          post: {
            id: 'post-uuid',
            caption: 'post-caption',
            type: 'post-type',
          },
          reports: [
            {
              id: 'report-uuid',
              reporter: {
                id: 'reporter-uuid',
                name: 'reporter-name',
              },
            },
          ],
        },
      ];
      const ModifiedReportedPosts = {
        reportedPostsCount: 1,
        reportedPosts: reportedPosts,
      };

      //mocks
      postRepository.getPostsReports.mockResolvedValue(dbResult);
      //actions
      const result = await service.getAllPostsReports();
      // assertions
      expect(result).toEqual(ModifiedReportedPosts);
    });
  });
});
