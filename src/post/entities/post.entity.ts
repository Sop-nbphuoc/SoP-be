import { UserEntity } from 'src/auth/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { LikeEntity } from './like.entity';
import { CommentEntity } from './comment.entity';

export interface Post {
  id?: number;
  desc?: string;
  img?: string;
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserEntity;
  userId?: string;
  comments?: CommentEntity[];
  likes?: LikeEntity[];
}

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  desc: string;

  @Column({ nullable: true })
  img: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.posts, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column()
  userId: string;

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.post)
  likes: LikeEntity[];
}
