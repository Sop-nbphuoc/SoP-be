import { ApiProperty } from "@nestjs/swagger";
import { Like } from "@prisma/client";

export class LikeEntity implements Like {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    userId: string;
    
    @ApiProperty({ required: false })
    postId: string | null;

    @ApiProperty({ required: false })
    commentId: string | null;
    
    @ApiProperty()
    createdAt: Date ;
}