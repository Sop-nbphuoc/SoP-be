import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User, UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockEntity } from './entities/block.entity';
import { Repository } from 'typeorm';
import { FollowerEnitity } from './entities/follower.entity';
import {
  FollowRequestEntity,
  FriendRequestStatus,
} from './entities/follower_r.entity';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(BlockEntity)
    private readonly blockRepository: Repository<BlockEntity>,
    @InjectRepository(FollowerEnitity)
    private readonly followerRepository: Repository<FollowerEnitity>,
    @InjectRepository(FollowRequestEntity)
    private readonly followRequestRepository: Repository<FollowRequestEntity>,
  ) {}
  private logger = new Logger('UserService');

  createUser(user: User): Observable<User> {
    this.logger.log('before save');
    return from(this.userRepository.save(user)).pipe(
      map((user: User) => {
        delete user.password;
        this.logger.log('after save');
        return user;
      }),
    );
  }

  findUserById(id: string): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: {
          id: id,
        },
        relations: [
          'followers',
          'followings',
          'blocks',
          'followRequestsReceived',
          'followRequestsSent',
        ],
      }),
    ).pipe(
      map((user: User) => {
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        delete user.password;
        return user;
      }),
    );
  }

  findUserByEmail(email: string): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: {
          email: email,
        },
        relations: ['followers', 'following', 'blocks', 'followRequests'],
      }),
    ).pipe(
      map((user: User) => {
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        delete user.password;
        return user;
      }),
    );
  }

  findUserByEmailForAuth(email: string): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: {
          email: email,
        },
        select: ['id', 'email', 'password', 'name'],
      }),
    );
  }

  updateUser(id: string, user: User): Observable<User> {
    return from(this.userRepository.update(id, user)).pipe(
      switchMap(() => this.findUserById(id)),
    );
  }

  switchFollow(
    followingId: string,
    followerId: string,
  ): Observable<FriendRequestStatus> {
    return from(
      this.followerRepository.findOne({
        where: {
          followingId: followingId,
          followerId: followerId,
        },
      }),
    ).pipe(
      map((follower: FollowerEnitity) => {
        if (follower) {
          this.followerRepository.delete(follower);
          return FriendRequestStatus.Declined;
        } else {
          this.followRequestRepository.save({
            senderId: followerId,
            receiverId: followingId,
          });
          return FriendRequestStatus.WaitingForCurrentUserResponse;
        }
      }),
    );
  }

  switchBlock(blockerId: string, blockedId: string): Observable<void> {
    return from(
      this.blockRepository.findOne({
        where: {
          blockerId: blockerId,
          blockedId: blockedId,
        },
      }),
    ).pipe(
      map((block: BlockEntity) => {
        if (block) {
          this.blockRepository.delete(block);
        } else {
          this.blockRepository.save({
            blockerId: blockerId,
            blockedId: blockedId,
          });
        }
      }),
    );
  }

  acceptFollowRequest(senderId: string, receiverId: string): Observable<void> {
    return from(
      this.followRequestRepository.findOne({
        where: {
          senderId: senderId,
          receiverId: receiverId,
        },
      }),
    ).pipe(
      map((followRequest: FollowRequestEntity) => {
        if (followRequest) {
          this.followRequestRepository.update(followRequest.id, {
            status: FriendRequestStatus.Accepted,
          });
          this.followerRepository.save({
            followingId: receiverId,
            followerId: senderId,
          });
        }
      }),
    );
  }

  declineFollowRequest(senderId: string, receiverId: string): Observable<void> {
    return from(
      this.followRequestRepository.findOne({
        where: {
          senderId: senderId,
          receiverId: receiverId,
        },
      }),
    ).pipe(
      map((followRequest: FollowRequestEntity) => {
        if (followRequest) {
          this.followRequestRepository.update(followRequest.id, {
            status: FriendRequestStatus.Declined,
          });
        }
      }),
    );
  }

  deleteFollowRequest(senderId: string, receiverId: string): Observable<void> {
    return from(
      this.followRequestRepository.findOne({
        where: {
          senderId: senderId,
          receiverId: receiverId,
        },
      }),
    ).pipe(
      map((followRequest: FollowRequestEntity) => {
        if (followRequest) {
          this.followRequestRepository.delete(followRequest);
        }
      }),
    );
  }

  getFollowRequests(userId: string): Observable<FollowRequestEntity[]> {
    return from(
      this.followRequestRepository.find({
        where: {
          receiverId: userId,
        },
      }),
    );
  }

  getFollowers(userId: string): Observable<FollowerEnitity[]> {
    return from(
      this.followerRepository.find({
        where: {
          followingId: userId,
        },
      }),
    );
  }

  getFollowing(userId: string): Observable<FollowerEnitity[]> {
    return from(
      this.followerRepository.find({
        where: {
          followerId: userId,
        },
      }),
    );
  }

  getBlocks(userId: string): Observable<BlockEntity[]> {
    return from(
      this.blockRepository.find({
        where: {
          blockerId: userId,
        },
      }),
    );
  }

  doesUserExist(email: string): Observable<boolean> {
    return from(
      this.userRepository.findOne({
        where: { email: email },
      }),
    ).pipe(
      switchMap((user: User) => {
        return of(!!user);
      }),
    );
  }
}
