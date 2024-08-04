import { CommentEntity } from 'src/post/entities/comment.entity';
import { LikeEntity } from 'src/post/entities/like.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { FollowerEnitity } from './follower.entity';
import { FollowRequestEntity, FollowRequest } from './follower_r.entity';
import { BlockEntity } from './block.entity';
import { StoryEntity } from 'src/post/entities/story.entity';

// user.ts
export class User {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
  cover?: string; 
  name?: string;
  surname?: string;
  description?: string;
  city?: string;
  school?: string;
  work?: string;
  website?: string;
  createdAt?: Date;
  posts?: PostEntity[];
  comments?: CommentEntity[];
  likes?: LikeEntity[];
  followers?: FollowerEnitity[];
  followings?: FollowerEnitity[];
  followRequestsSent?: FollowRequest[];
  followRequestsReceived?: FollowRequest[];
  blocks?: BlockEntity[];
  blockedBy?: BlockEntity[];
  stories?: StoryEntity[];
}

@Entity('user')  
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  cover: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  surname: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  school: string;

  @Column({ nullable: true })
  work: string;

  @Column({ nullable: true })
  website: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes: LikeEntity[];

  @OneToMany(() => FollowerEnitity, (follower) => follower.follower)
  followers: FollowerEnitity[];

  @OneToMany(() => FollowerEnitity, (follower) => follower.following)
  followings: FollowerEnitity[];

  @OneToMany(() => FollowRequestEntity, (followRequest) => followRequest.sender)
  followRequestsSent: FollowRequestEntity[];

  @OneToMany(() => FollowRequestEntity, (followRequest) => followRequest.receiver)
  followRequestsReceived: FollowRequestEntity[];

  @OneToMany(() => BlockEntity, (block) => block.blocker)
  blocks: BlockEntity[];

  @OneToMany(() => BlockEntity, (block) => block.blocked)
  blockedBy: BlockEntity[];

  @OneToMany(() => StoryEntity, (story) => story.user)
  stories: StoryEntity[];
}