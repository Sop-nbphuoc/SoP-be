import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserEntity } from "./entities/user.entity";
import { FollowRequestEntity } from "./entities/follower_r.entity";
import { BlockEntity } from "./entities/block.entity";
import { FollowerEnitity } from "./entities/follower.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
        UserEntity,
        FollowerEnitity,
        FollowRequestEntity,
        BlockEntity,
        ]),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}