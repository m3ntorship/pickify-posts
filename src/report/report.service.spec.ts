import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackRepository } from './entities/feedback.repository';
import { ReportService } from './report.service';

describe('ReportService', () => {
  let service: ReportService;
  let feedbackRepository: FeedbackRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportService, FeedbackRepository],
    }).compile();

    service = module.get<ReportService>(ReportService);
    feedbackRepository = module.get<FeedbackRepository>(FeedbackRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service).toHaveProperty('getFeedBacks');
  });

  describe('get feedbacks', () => {
    it('should return array of feedbacks', async () => {
      //data
      const feedbacks = [
        {
          feedback_body: 'Good Idea',
          feedback_choice: 4,
          user: {
            uuid: 'user-uuid',
          },
        },
      ];

      // mocks
      feedbackRepository.getAllFeedBacks = jest
        .fn()
        .mockResolvedValueOnce(feedbacks);

      //actions
      const result = await service.getFeedBacks();

      //assertions
      expect(result).toEqual(feedbacks);
    });
  });
});
