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
    createPostsReport: jest.fn().mockResolvedValue(undefined),
  };
  const postRepository = {
    findOne: jest.fn().mockResolvedValue({ uuid: 'post-uuid' } as Post),

    getPostsReports: jest.fn().mockResolvedValue([
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
    ]),
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
      const count = 0;
      const reporter: User = {
        uuid: 'test-user-uuid',
        dailyReportsCount: count,
      } as User;
      //mocks

      //actions
      const result = await service.createPostsReport(Dto, reporter);

      // assertions
      expect(postRepository.findOne).toBeCalled();
      expect(reporter.dailyReportsCount).toBe(count + 1);
      expect(result).toBeUndefined();
    });
    it('should throw error if reported post not exist', async () => {
      //data
      const Dto: CreatePostsReportDTO = {
        postId: 'post-uuid',
        reportType: 'Report-type',
      };
      const count = 0;
      const reporter: User = {
        uuid: 'test-user-uuid',
        dailyReportsCount: count,
      } as User;
      //mocks
      postRepository.findOne = jest.fn().mockResolvedValue(undefined); // undo later

      //actions

      // assertions
      await expect(
        service.createPostsReport(Dto, reporter),
      ).rejects.toThrowError(new NotFoundException('Post not found'));

      expect(reporter.dailyReportsCount).toBe(count);
    });
    it('should throw error if user reports count reached 50', async () => {
      //data
      const Dto: CreatePostsReportDTO = {
        postId: 'post-uuid',
        reportType: 'Report-type',
      };
      const count = 50;
      const reporter: User = {
        uuid: 'test-user-uuid',
        dailyReportsCount: count,
      } as User;
      //mocks
      postRepository.findOne = jest
        .fn()
        .mockResolvedValue({ uuid: 'post-uuid' } as Post);
      //actions

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

      expect(reporter.dailyReportsCount).toBe(count);
    });
    it('shoud throw error if reporting post twice', async () => {
      //data
      const Dto: CreatePostsReportDTO = {
        postId: 'post-uuid',
        reportType: 'Report-type',
      };
      const count = 0;
      const reporter: User = {
        uuid: 'test-user-uuid',
        dailyReportsCount: count,
      } as User;
      //mocks
      postsReportRepository.createPostsReport = jest.fn().mockRejectedValue(
        new HttpException(
          {
            message: "Reporter can't report same post twoice",
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
            message: "Reporter can't report same post twoice",
          },
          HttpStatus.CONFLICT,
        ),
      );
    });
  });
  describe('Get All posts reports', () => {
    it('should return each reported posts, each post with its reports', async () => {
      //data

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
      //actions
      const result = await service.getAllPostsReports();
      // assertions
      expect(result).toEqual(ModifiedReportedPosts);
    });
  });
});
