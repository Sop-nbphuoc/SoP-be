import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FollowerEnitity } from './entities/follower.entity';
import { FollowRequestEntity } from './entities/follower_r.entity';
import { BlockEntity } from './entities/block.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      FollowerEnitity,
      FollowRequestEntity,
      BlockEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
