import { ApiProperty } from "@nestjs/swagger";
import { Role, FollowRequest } from "@prisma/client";

export class FollowRequestEntity implements FollowRequest {
    @ApiProperty({ required: false, nullable: true })
    id: string | null;

    @ApiProperty()
    senderId: string;

    @ApiProperty()
    receiverId: string;

    @ApiProperty()
    createdAt: Date;
} 