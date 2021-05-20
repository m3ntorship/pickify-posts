import { EntityRepository, Repository } from 'typeorm';
import { Option } from './option.entity';

@EntityRepository(Option)
export class OptionRepository extends Repository<Option> {}
