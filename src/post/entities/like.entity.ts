import { UserEntity } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Column } from 'typeorm';
import { PostEntity } from './post.entity';
import { CommentEntity } from './comment.entity';
 
export interface Like {
  id?: number;
  createdAt?: Date;
  user?: UserEntity;
  userId?: string;
  post?: PostEntity;
  postId?: number;
  comment?: CommentEntity;
  commentId?: number;
}

@Entity('like')
export class LikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.likes, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column()
  userId: string;

  @ManyToOne(() => PostEntity, (post) => post.likes, { nullable: true, onDelete: 'CASCADE' })
  post: PostEntity;

  @Column({ nullable: true })
  postId: number;

  @ManyToOne(() => CommentEntity, (comment) => comment.likes, { nullable: true, onDelete: 'CASCADE' })
  comment: CommentEntity;

  @Column({ nullable: true })
  commentId: number;
}
