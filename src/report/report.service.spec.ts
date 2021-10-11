import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { PostRepository } from '../posts/entities/post.repository';
import { UserRepository } from '../users/entities/user.repository';
import { CreatePostsReportDTO } from './dto/createReport.dto';
import { PostsReportRepository } from './entities/report.repository';
import { ReportService } from './report.service';
import { Post } from '../posts/entities/post.entity';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { PostsService } from '../posts/posts.service';
import { getNow } from '../shared/utils/datetime';

describe('ReportService', () => {
  const postsReportRepository = {
    createPostsReport: jest.fn(),
    getUserReportsCount: jest.fn(),
  };
  const postRepository = {
    getDetailedPostById: jest.fn(),
    getPostsReports: jest.fn(),
  };
  const userRepositoy = {
    save: jest.fn().mockResolvedValue(undefined),
  };
  const postService = {
    modifyGroupsData: jest.fn(),
  };
  let service: ReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: PostsReportRepository, useValue: postsReportRepository },
        { provide: PostRepository, useValue: postRepository },
        { provide: UserRepository, useValue: userRepositoy },
        { provide: PostsService, useValue: postService },
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
        post_id: 'post-uuid',
        report_type: 'Report-type',
      };

      const reporter: User = {
        uuid: 'test-user-uuid',
      } as User;

      //mocks
      postRepository.getDetailedPostById.mockResolvedValue({
        uuid: 'post-uuid',
        user: { uuid: 'user-uuid' },
      } as Post);
      postsReportRepository.getUserReportsCount.mockResolvedValue(5);
      postsReportRepository.createPostsReport.mockResolvedValue(undefined);

      //actions
      const result = await service.createPostsReport(Dto, reporter);

      // assertions
      expect(result).toBeUndefined();
    });

    it('should throw error if reported post not exist', async () => {
      //data
      const Dto: CreatePostsReportDTO = {
        post_id: 'post-uuid',
        report_type: 'Report-type',
      };

      const reporter: User = {
        uuid: 'test-user-uuid',
      } as User;
      //mocks
      postRepository.getDetailedPostById = jest
        .fn()
        .mockResolvedValue(undefined);

      //actions

      // assertions
      await expect(
        service.createPostsReport(Dto, reporter),
      ).rejects.toThrowError(new NotFoundException('Post not found'));
    });

    it('should throw error if user reports count reached 50', async () => {
      //data
      const Dto: CreatePostsReportDTO = {
        post_id: 'post-uuid',
        report_type: 'Report-type',
      };

      const reporter: User = {
        uuid: 'test-user-uuid',
      } as User;

      //mocks

      postRepository.getDetailedPostById = jest.fn().mockResolvedValue({
        uuid: 'post-uuid',
        user: { uuid: 'user-uuid' },
      } as Post);
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
        post_id: 'post-uuid',
        report_type: 'Report-type',
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
      const dbResult = {
        uuid: 'post-uuid',
        caption: 'post-caption',
        is_hidden: false,
        created_at: getNow().toDate(),
        type: 'text poll',
        user: {
          uuid: 'user-uuid',
          name: 'test',
          profile_pic: 'test-url',
        },
        media: [{ url: 'test-media-url' }],
        groups: [
          {
            uuid: 'test-group-uuid',
            name: 'test-group-name',
            media: [],
            options: [
              {
                vote_count: 2,
                body: 'test-option-body',
                uuid: 'test-option32-uuid',
                media: [],
                voted: false,
              },
            ],
          },
        ],
        postsReports: [
          {
            uuid: 'report-uuid',
            reporter: {
              uuid: 'reporter-uuid',
              name: 'reporter-name',
            },
          },
        ],
      };
      const modifiedreportedPosts = [
        {
          post: {
            id: dbResult.uuid,
            user: {
              id: dbResult.user.uuid,
              name: dbResult.user.name,
              profile_pic: dbResult.user.profile_pic,
            },
            caption: dbResult.caption,
            media: dbResult.media,
            is_hidden: dbResult.is_hidden,
            created_at: dbResult.created_at,
            type: dbResult.type,
            options_groups: {
              groups: [
                {
                  id: dbResult.groups[0].uuid,
                  name: dbResult.groups[0].name,
                  media: dbResult.groups[0].media,
                  options: [
                    {
                      id: dbResult.groups[0].options[0].vote_count,
                      body: dbResult.groups[0].options[0].body,
                      vote_count: dbResult.groups[0].options[0].vote_count,
                      media: dbResult.groups[0].options[0].media,
                      voted: dbResult.groups[0].options[0].voted,
                    },
                  ],
                },
              ],
            },
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
      const returnedReportedPosts = {
        reportedPostsCount: 1,
        reportedPosts: modifiedreportedPosts,
      };

      //mocks
      postRepository.getPostsReports.mockResolvedValue([dbResult]);
      postService.modifyGroupsData.mockReturnValue(
        modifiedreportedPosts[0].post.options_groups.groups,
      );
      //actions
      const result = await service.getAllPostsReports();
      // assertions
      expect(result).toEqual(returnedReportedPosts);
    });
  });
});
