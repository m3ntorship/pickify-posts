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
    option.vote_count = 0;
    return await this.save(option);
  }

  /**
   * get option with relation to vote, grous & post
   */

  public async findOptionById(optionId: string): Promise<Option> {
    return await this.createQueryBuilder('options')
      .where('options.uuid = :optionId', { optionId })
      .leftJoinAndSelect('options.votes', 'vote')
      .leftJoinAndSelect('options.optionsGroup', 'optionsGroup')
      .leftJoinAndSelect('optionsGroup.options', 'option')
      .leftJoinAndSelect('optionsGroup.post', 'post')
      .getOne();

    // or using findOne
    // return await this.findOne({
    //   where: { uuid: optionId },
    //   relations: [
    //     'votes',
    //     'optionsGroup',
    //     'optionsGroup.options',
    //     'optionsGroup.post',
    //   ],
    // });
  }

  public async incrementVoteCount(option: Option): Promise<Option> {
    option.vote_count++;
    await this.save(option);
    return option;
  }
}
