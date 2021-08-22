import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackRepository } from './entities/feedback.repository';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

describe('ReportController', () => {
  let controller: ReportController;
  let service: ReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [ReportService, FeedbackRepository],
    }).compile();

    controller = module.get<ReportController>(ReportController);
    service = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getFeedBack function', () => {
    it('it should return array of feedbacks', async () => {
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

      //mock
      service.getFeedBacks = jest.fn().mockResolvedValueOnce(feedbacks);
      //action
      const result = await controller.getFeedbacks();

      //assertion
      expect(result).toEqual(feedbacks);
    });
  });
});
