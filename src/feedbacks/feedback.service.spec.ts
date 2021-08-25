import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { FeedbackCreationDto } from './dto/feedback.dto';
import { FeedbackRepository } from './entities/feedback.repository';
import { FeedBackService } from './feedback.service';

describe('FeedBackService', () => {
  let service: FeedBackService;
  let feedbackRepository: FeedbackRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedBackService, FeedbackRepository],
    }).compile();

    service = module.get<FeedBackService>(FeedBackService);
    feedbackRepository = module.get<FeedbackRepository>(FeedbackRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service).toHaveProperty('getAllFeedBacks');
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
      const result = await service.getAllFeedBacks();

      //assertions
      expect(result).toEqual(feedbacks);
    });
  });
  describe('Create feedback function', () => {
    it('should create feedback', async () => {
      // data
      const dto: FeedbackCreationDto = {
        feedback_body: 'good idea',
        feedback_rating: 4,
      };
      const user = {
        uuid: 'test-user-uuid',
      } as User;
      //mocks
      feedbackRepository.createFeedback = jest.fn().mockImplementation();
      //action
      const result = await service.createFeedback(dto, user);
      //assertion
      expect(feedbackRepository.createFeedback).toBeCalledWith(dto, user);
      expect(feedbackRepository.createFeedback).toBeCalledTimes(1);
    });
  });
});
