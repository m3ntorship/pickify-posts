import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackCreationDto } from './dto/feedback.dto';
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
  describe('Create feedback function', () => {
    it('should create feedback', async () => {
      //data
      const dto: FeedbackCreationDto = {
        feedback_body: 'good idea',
        feedback_choice: 4,
      };
      const req: any = { user: { uuid: 'user-uuid' } };
      //mocks
      service.createFeedback = jest.fn().mockImplementation();

      //actions
      const result = await service.createFeedback(dto, req.user);

      //assertions
      expect(service.createFeedback).toBeCalledWith(dto, req.user);
      expect(service.createFeedback).toBeCalledTimes(1);
    });
  });
});
