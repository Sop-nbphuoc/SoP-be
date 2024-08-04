import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Column, Unique } from 'typeorm';
import { UserEntity, User } from './user.entity';

export interface FollowRequest {
  id?: number;
  sender?: User;
  senderId?: string;
  receiver?: User;
  receiverId?: string;
  createdAt?: Date;
}

@Entity()
@Unique(['senderId', 'receiverId'])
export class FollowRequestEntity implements FollowRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.followRequestsSent, { onDelete: 'CASCADE' })
  sender: UserEntity;

  @Column()
  senderId: string;

  @ManyToOne(() => UserEntity, (user) => user.followRequestsReceived, { onDelete: 'CASCADE' })
  receiver: UserEntity;

  @Column()
  receiverId: string;
}
