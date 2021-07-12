import { EntityRepository, Repository } from 'typeorm';
import { Option } from './option.entity';
import { OptiosnGroup } from './optionsGroup.entity';
import { OptionDto } from '../dto/optionGroupCreation.dto';

@EntityRepository(Option)
export class OptionRepository extends Repository<Option> {
  /**
   * create bulk options with one to many relation to optionsGroup entity
   */

  public async createBulk(
    optionsData: OptionDto[],
    group: OptiosnGroup,
  ): Promise<Option[]> {
    // create option object with each optionData
    const options = optionsData.map((option, index) => {
      const newOption = this.create();
      newOption.body = option.body;
      newOption.vote_count = 0;
      newOption.order = index;

      if (group) {
        newOption.optionsGroup = group;
      }
      return newOption;
    });

    // save all option objects into DB
    return await this.save(options);
  }

  /**
   * get option with relation to vote, grous & post
   */

  public async findDetailedOptionById(optionId: string): Promise<Option> {
    return await this.createQueryBuilder('option')
      .where('option.uuid = :optionId', { optionId })
      .leftJoinAndSelect('option.votes', 'vote')
      .leftJoinAndSelect('vote.user', 'vote_user')
      .leftJoinAndSelect('option.optionsGroup', 'options_Group')
      .leftJoinAndSelect('options_Group.post', 'post')
      .leftJoinAndSelect('post.user', 'post_user')
      .leftJoinAndSelect('options_Group.options', 'option_in_group')
      .leftJoinAndSelect('option_in_group.votes', 'deep_vote')
      .leftJoinAndSelect('deep_vote.user', 'deep_vote_user')
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

  // this method returns an optionsGroup with relation to the passed entityType
  // if no entityType is passed, it returns the optionsGroup without any relations
  public async getByID(id: string, entityType?: string): Promise<Option> {
    switch (entityType) {
      case undefined:
        return await this.createQueryBuilder('option')
          .where('option.uuid = :id', { id: id })
          .getOne();

      case 'post':
        return await this.createQueryBuilder('option')
          .where('option.uuid = :id', { id: id })
          .leftJoinAndSelect('option.optionsGroup', 'group')
          .leftJoinAndSelect('group.post', 'post')
          .getOne();

      case 'optionsGroup':
        return await this.createQueryBuilder('option')
          .where('option.uuid = :id', { id: id })
          .leftJoinAndSelect('option.group', 'group')
          .getOne();

      default:
        break;
    }
  }
}
