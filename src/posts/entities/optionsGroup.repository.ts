import { EntityRepository, Repository } from 'typeorm';
import { OptionsGroupDto } from '../dto/optionGroupCreation.dto';
import { OptiosnGroup } from './optionsGroup.entity';
import { Post } from './post.entity';
@EntityRepository(OptiosnGroup)
export class OptionsGroupRepository extends Repository<OptiosnGroup> {
  /**
   * add a new group in DB
   */
  public async createGroup(
    post: Post,
    groupDto: OptionsGroupDto,
    groupOrder: number,
  ): Promise<OptiosnGroup> {
    const group = this.create();

    group.name = groupDto.name;
    group.post = post;
    group.order = groupOrder;

    return await this.save(group);
  }

  // Get optionsGroup with related post
  public async getByID(id: string): Promise<OptiosnGroup> {
    return await this.createQueryBuilder('optionsGroup')
      .where('optionsGroup.uuid = :id', { id: id })
      .leftJoinAndSelect('optionsGroup.post', 'post')
      .getOne();
  }
}
