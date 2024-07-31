import { ApiProperty } from "@nestjs/swagger";
import { Comment } from "@prisma/client";


export class CommentEntity implements Comment {
    @ApiProperty()
    id: string;

    @ApiProperty()
    desc: string;
    
    @ApiProperty()
    createdAt: Date;
    
    @ApiProperty()
    updatedAt: Date;
    
    @ApiProperty()
    userId: string;
    
    @ApiProperty()
    postId: string;
}