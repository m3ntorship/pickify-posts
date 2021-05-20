import { EntityRepository, Repository } from 'typeorm';
import { OptiosnGroup } from './optionsGroup.entity';

@EntityRepository(OptiosnGroup)
export class OptionsGroupRepository extends Repository<OptiosnGroup> {}
