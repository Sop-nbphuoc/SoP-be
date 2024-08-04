import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Column, Unique } from 'typeorm';
import { User, UserEntity } from './user.entity';

export interface Follower {
  id?: number;
  follower?: User;
  followerId?: string;
  following?: User;
  followingId?: string;
  createdAt?: Date;
}


@Entity()
@Unique(['followerId', 'followingId'])
export class FollowerEnitity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.followers, { onDelete: 'CASCADE' })
  follower: UserEntity;

  @Column()
  followerId: string;

  @ManyToOne(() => UserEntity, (user) => user.followings, { onDelete: 'CASCADE' })
  following: UserEntity;

  @Column()
  followingId: string;
}
