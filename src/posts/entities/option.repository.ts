import { EntityRepository, Repository } from 'typeorm';
import { Option } from './option.entity';
import { OptiosnGroup } from './optionsGroup.entity';
import { OptionDto } from '../dto/optionGroupCreation.dto';

@EntityRepository(Option)
export class OptionRepository extends Repository<Option> {
  /**
   * createOption   */
  public async createOption(
    group: OptiosnGroup,
    optionData: OptionDto,
  ): Promise<Option> {
    const option = this.create();
    option.optionsGroup = group;
    option.body = optionData.body;
    option.vote_count = optionData.vote_count;
    // group.post = post;
    await option.save();
    return option;
  }
}
