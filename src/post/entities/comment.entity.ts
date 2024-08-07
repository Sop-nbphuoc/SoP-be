import { UserEntity } from 'src/auth/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { PostEntity } from './post.entity';
import { LikeEntity } from './like.entity';

export interface Comment {
  id?: number;
  desc?: string;
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserEntity;
  userId?: string;
  post?: PostEntity;
  postId?: number;
  likes?: LikeEntity[];
}

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  desc: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.comments, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column()
  userId: string;

  @ManyToOne(() => PostEntity, (post) => post.comments, { onDelete: 'CASCADE' })
  post: PostEntity;

  @Column()
  postId: number;

  @OneToMany(() => LikeEntity, (like) => like.comment)
  likes: LikeEntity[];
}
