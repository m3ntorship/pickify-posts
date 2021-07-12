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

  // this method returns an optionsGroup with relation to the passed entityType
  // if no entityType is passed, it returns the optionsGroup without any relations
  public async getByID(id: string, entityType?: string): Promise<OptiosnGroup> {
    switch (entityType) {
      case undefined:
        return await this.createQueryBuilder('optionsGroup')
          .where('optionsGroup.uuid = :id', { id: id })
          .getOne();
      case 'post':
        return await this.createQueryBuilder('optionsGroup')
          .where('optionsGroup.uuid = :id', { id: id })
          .leftJoinAndSelect('optionsGroup.post', 'post')
          .getOne();

      case 'option':
        return await this.createQueryBuilder('optionsGroup')
          .where('optionsGroup.uuid = :id', { id: id })
          .leftJoinAndSelect('optionsGroup.options', 'option')
          .getOne();

      default:
        break;
    }
  }
}
