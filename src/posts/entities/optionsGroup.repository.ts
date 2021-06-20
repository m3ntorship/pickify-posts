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
  ): Promise<OptiosnGroup> {
    const group = this.create();
    group.name = groupDto.name;
    group.post = post;

    return await this.save(group);
  }
}
