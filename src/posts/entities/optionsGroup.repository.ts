import { EntityRepository, Repository } from 'typeorm';
import { OptiosnGroup } from './optionsGroup.entity';
import { Post } from './post.entity';

@EntityRepository(OptiosnGroup)
export class OptionsGroupRepository extends Repository<OptiosnGroup> {
  /**
   * createGroup
   */
  public async createGroup(
    postid: string,
    name: string,
  ): Promise<OptiosnGroup> {
    // const post = await this.manager
    //   .getRepository(Post)
    //   .findOne({ where: { uuid: postid } });
    const group = this.create();
    group.name = name;
    // group.post = post;
    await group.save();
    return group;
  }
}
