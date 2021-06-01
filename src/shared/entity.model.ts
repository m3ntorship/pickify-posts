import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { getNow } from '../shared/utils/datetime';

// TODO: not sure if there is a way to add this
// using annotation or static class method
// to be shared with all Model extending the `Model`
export const POSTS_SCHEMA = 'pickify_posts';

export default abstract class Model extends BaseEntity {
  constructor(model?: Partial<any>) {
    super();
    Object.assign(this, model);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  uuid: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @BeforeInsert()
  createUuid() {
    this.uuid = uuid();
  }

  @BeforeInsert()
  addInteractionDates() {
    const date = getNow().toDate();
    this.created_at = date;
    this.updated_at = date;
  }

  @BeforeUpdate()
  addUpdatedAt() {
    const date = getNow().toDate();
    this.updated_at = date;
  }

  toJSON() {
    return { ...this, id: undefined };
  }
}
