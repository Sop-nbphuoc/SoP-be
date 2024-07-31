import { ApiProperty } from "@nestjs/swagger";
import { Role, Follower } from "@prisma/client";

export class FollowerEntity implements Follower {
    @ApiProperty({ required: false, nullable: true })
    id: string | null;

    @ApiProperty()
    followerId: string;

    @ApiProperty()
    followingId: string;

    @ApiProperty()
    createdAt: Date;
}