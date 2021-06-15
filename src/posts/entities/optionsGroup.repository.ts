import { EntityRepository, Repository } from 'typeorm';
import { OptiosnGroup } from './optionsGroup.entity';
import { Post } from './post.entity';
@EntityRepository(OptiosnGroup)
export class OptionsGroupRepository extends Repository<OptiosnGroup> {
  /**
   * createGroup
   */
  public async createGroup(post: Post, name: string): Promise<OptiosnGroup> {
    const group = this.create();
    group.name = name;
    group.post = post;
    return await this.save(group);
  }
}
