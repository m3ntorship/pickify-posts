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
      newOption.order = index + 1;

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
    return await this.createQueryBuilder('options')
      .where('options.uuid = :optionId', { optionId })
      .leftJoinAndSelect('options.votes', 'vote')
      .leftJoinAndSelect('vote.user', 'user')
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
