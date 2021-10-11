import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { FeedbackCreationDto } from './dto/feedback.dto';
import { FeedbackRepository } from './entities/feedback.repository';
import { FeedBackService } from './feedback.service';

describe('FeedBackService', () => {
  let service: FeedBackService;

  const feedbackRepository = {
    getAllFeedBacks: jest.fn().mockResolvedValueOnce([
      {
        feedback_body: 'Good Idea',
        feedback_rating: 4,
        user: {
          uuid: 'user-uuid',
          name: 'user-name',
          profile_pic: 'user-profile-pic',
        },
      },
    ]),
    createFeedback: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: FeedbackRepository, useValue: feedbackRepository },
        FeedBackService,
      ],
    }).compile();

    service = module.get<FeedBackService>(FeedBackService);
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
          feedback_rating: 4,
          user: {
            uuid: 'user-uuid',
            name: 'user-name',
            profile_pic: 'user-profile-pic',
          },
        },
      ];
      const modifiedfeedbacks = {
        feedbacksCount: 1,
        feedbacks: [
          {
            feedback_body: feedbacks[0].feedback_body,
            feedback_rating: feedbacks[0].feedback_rating,
            user: {
              id: feedbacks[0].user.uuid,
              name: feedbacks[0].user.name,
              profile_pic: feedbacks[0].user.profile_pic,
            },
          },
        ],
      };

      //actions
      const result = await service.getAllFeedBacks();

      //assertions
      expect(result).toEqual(modifiedfeedbacks);
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
      //action
      const result = await service.createFeedback(dto, user);
      //assertion
      expect(feedbackRepository.createFeedback).toBeCalledWith(dto, user);
      expect(result).toBeUndefined();
    });
  });
});
