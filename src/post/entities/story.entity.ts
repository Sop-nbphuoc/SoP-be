import {  UserEntity } from 'src/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Column, Unique } from 'typeorm';

export interface Story {
  id?: number;
  createdAt?: Date;
  expiresAt?: Date;
  img?: string;
  user?: UserEntity;
  userId?: string;
}

@Entity()
export class StoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date;

  @Column()
  img: string;

  @ManyToOne(() => UserEntity, (user) => user.stories, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column({ unique: true })
  userId: string;
}
