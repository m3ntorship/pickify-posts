import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getNow } from '../../shared/utils/datetime/now';
import { OptiosnGroup } from './optionsGroup.entity';
import { OptionRepository } from './option.repository';
import { OptionDto } from '../dto/optionGroupCreation.dto';
import { Option } from './option.entity';

jest.mock('../../shared/utils/datetime/now');

// Mock typeorm which mocks all its methods and make them return undefined
jest.mock('typeorm', () => ({
  EntityRepository: () => jest.fn(),
  Repository: class Repository {},
  Entity: () => jest.fn(),
  BaseEntity: class Mock {},
  BeforeInsert: () => jest.fn(),
  BeforeUpdate: () => jest.fn(),
  Column: () => jest.fn(),
  CreateDateColumn: () => jest.fn(),
  PrimaryGeneratedColumn: () => jest.fn(),
  UpdateDateColumn: () => jest.fn(),
  OneToMany: () => jest.fn(),
  ManyToOne: () => jest.fn(),
}));

describe('Option Repository', () => {
  let optionRepository: OptionRepository;
  const now = getNow().toDate();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OptionRepository],
    }).compile();

    optionRepository = module.get<OptionRepository>(OptionRepository);
  });

  it('should be defined and have necessary methods', () => {
    expect(optionRepository).toBeDefined();
    expect(optionRepository).toHaveProperty('createOption');
  });

  describe('createOption method', () => {
    it('should return new created option', async () => {
      // Data
      ///////
      const group = {
        created_at: now,
        updated_at: now,
        uuid: 'test-group-uuid',
        id: 1,
        name: 'test group name',
        post: { id: 1 },
        options: [],
      } as OptiosnGroup;

      const optionData: OptionDto = {
        body: 'test option body',
      };

      const createdOption = {
        body: 'test option body',
        created_at: now,
        updated_at: now,
        id: 1,
        uuid: 'test-option-uuid',
        vote_count: 0,
        optionsGroup: group,
      } as Option;

      // mocks
      ///////
      // Mock this.create() inside optionsGroupRepository
      Repository.prototype.create = jest.fn(() => {
        return new Option();
      }) as any;

      // Mock this.save() inside optionsGroupRepository
      Repository.prototype.save = jest.fn((option) => {
        option.id = 1;
        option.updated_at = now;
        option.created_at = now;
        option.uuid = 'test-option-uuid';
        return new Promise((resolve) => {
          resolve(option);
        });
      });

      // assertions
      expect(optionRepository.createOption(group, optionData)).resolves.toEqual(
        createdOption,
      );
    });
  });
});
