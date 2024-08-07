import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Column, Unique } from 'typeorm';
import { UserEntity, User } from './user.entity';

export interface FollowRequest {
  id?: number;
  sender?: User;
  senderId?: string;
  receiver?: User;
  receiverId?: string;
  status?: FriendRequestStatus;
  createdAt?: Date;
}

export enum FriendRequestStatus {
  NotSent = 'not-sent',
  Accepted = 'accepted',
  Declined = 'declined',
  WaitingForCurrentUserResponse = 'waiting-for-current-user-response'
}



@Entity('follow_request')
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

  @Column({default: FriendRequestStatus.NotSent})
  status: FriendRequestStatus;

  @Column()
  receiverId: string;
}
