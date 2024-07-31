import { ApiProperty } from "@nestjs/swagger";
import { Post } from "@prisma/client";


export class PostEntity implements Post {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    desc: string;
    
    @ApiProperty({ required: false })
    img: string | null;
    
    @ApiProperty()
    createdAt: Date;
    
    @ApiProperty()
    updatedAt: Date;
    
    @ApiProperty()
    userId: string;
}
