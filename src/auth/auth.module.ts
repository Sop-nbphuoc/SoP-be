import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FollowerEnitity } from './entities/follower.entity';
import { FollowRequestEntity } from './entities/follower_r.entity';
import { BlockEntity } from './entities/block.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './service/user.service';
import { AccessTokenStrategy } from './guards/access.strategy';
import { RefreshTokenStrategy } from './guards/refresh.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      UserEntity,
      FollowerEnitity,
      FollowRequestEntity,
      BlockEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService,UserService,AccessTokenStrategy,RefreshTokenStrategy],
})
export class AuthModule {}
