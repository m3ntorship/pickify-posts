import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackCreationDto } from './dto/feedback.dto';
import { FeedbackRepository } from './entities/feedback.repository';
import { FeedBackController } from './feedback.controller';
import { FeedBackService } from './feedback.service';

describe('FeedBackController', () => {
  let controller: FeedBackController;
  const service = {
    getAllFeedBacks: jest.fn().mockResolvedValue([
      {
        feedback_body: 'Good Idea',
        feedback_choice: 4,
        user: {
          uuid: 'user-uuid',
        },
      },
    ]),
    createFeedback: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedBackController],
      providers: [{ provide: FeedBackService, useValue: service }],
    }).compile();
    controller = module.get<FeedBackController>(FeedBackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllFeedBacks function', () => {
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

      //action
      const result = await controller.getAllFeedbacks();

      //assertion
      expect(result).toEqual(feedbacks);
    });
  });

  describe('Create feedback function', () => {
    it('should create feedback', async () => {
      //data
      const dto: FeedbackCreationDto = {
        feedback_body: 'good idea',
        feedback_rating: 4,
      };

      const req: any = { user: { uuid: 'user-uuid' } };

      //actions
      const result = await controller.createFeedback(dto, req);

      //assertions
      expect(result).toBeUndefined();
    });
  });
});
