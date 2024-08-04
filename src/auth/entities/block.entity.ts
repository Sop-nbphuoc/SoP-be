import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Column, Unique } from 'typeorm';
import { UserEntity, User } from './user.entity';

export interface Block {
  id?: number;
  blocker?: User;
  blockerId?: string;
  blocked?: User;
  blockedId?: string;
  createdAt?: Date;
}


@Entity()
@Unique(['blockerId', 'blockedId'])
export class BlockEntity implements Block {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.blocks, { onDelete: 'CASCADE' })
  blocker: UserEntity;

  @Column()
  blockerId: string;

  @ManyToOne(() => UserEntity, (user) => user.blockedBy, { onDelete: 'CASCADE' })
  blocked: UserEntity;

  @Column()
  blockedId: string;
}
