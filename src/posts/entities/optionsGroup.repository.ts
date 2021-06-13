import { NotFoundException } from '@nestjs/common';
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
    try {
      const post = await this.manager
        .getRepository(Post)
        .findOne({ where: { uuid: postid } });
      if (!post)
        throw new NotFoundException(`Post with id: ${postid} not found`);
      const group = this.create();
      group.name = name;
      group.post = post;
      return await this.save(group);
    } catch (err) {
      throw err;
    }
  }
}
