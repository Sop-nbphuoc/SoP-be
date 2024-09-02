import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { FollowerEnitity } from '../user/entities/follower.entity';
import { FollowRequestEntity } from '../user/entities/follower_r.entity';
import { BlockEntity } from '../user/entities/block.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './guards/access.strategy';
import { RefreshTokenStrategy } from './guards/refresh.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule.register({}),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,AccessTokenStrategy,RefreshTokenStrategy],
})
export class AuthModule {}
