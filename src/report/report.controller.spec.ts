import { Test, TestingModule } from '@nestjs/testing';
import { isDefined } from 'class-validator';
import { CreatePostsReportDTO } from './dto/createReport.dto';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

describe('ReportsController', () => {
  let controller: ReportController;
  const mockService = {
    createPostsReport: jest.fn().mockResolvedValue(undefined),
    getAllPostsReports: jest.fn().mockResolvedValue({
      reportedPostsCount: 1,
      reportedPosts: [
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
      ],
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [{ provide: ReportService, useValue: mockService }],
    }).compile();

    controller = module.get<ReportController>(ReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller).toHaveProperty('createPostsReport');
    expect(controller).toHaveProperty('getPostsReports');
  });
  describe('Create Report function', () => {
    it('should create report', async () => {
      //mocks
      const createPostsReportDTO: CreatePostsReportDTO = {
        postId: 'reported-post-id',
        reportType: 'post',
      };
      const req: any = { user: { uuid: 'user-uuid' } };
      const result = await controller.createPostsReport(
        req.user,
        createPostsReportDTO,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('Get Reports Function', () => {
    it('should return object of reportedPosts count and array of reportedPosts', async () => {
      //mocks
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
      const returnedReportedPost = {
        reportedPostsCount: reportedPosts.length,
        reportedPosts: reportedPosts,
      };
      const result = await controller.getPostsReports();
      expect(result).toEqual(returnedReportedPost);
    });
  });
});
