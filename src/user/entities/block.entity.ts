import { ApiProperty } from "@nestjs/swagger";
import { Role, Block } from "@prisma/client";

export class BlockEntity implements Block {
    @ApiProperty({ required: false, nullable: true })
    id: string | null;

    @ApiProperty()
    blockedId: string;
    
    @ApiProperty()
    blockerId: string;

    @ApiProperty()
    createdAt: Date;
}