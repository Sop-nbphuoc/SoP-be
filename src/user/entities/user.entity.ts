import { ApiProperty } from "@nestjs/swagger";
import { Role, User } from "@prisma/client";

export class UserEtity implements User {
    @ApiProperty({ required: false, nullable: true })
    id: string | null;

    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    role: Role;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    avatar: string;

    @ApiProperty()
    cover: string;

    @ApiProperty({ required: false, nullable: true })
    description: string | null;

    @ApiProperty({ required: false, nullable: true })
    city: string | null;

    @ApiProperty({ required: false, nullable: true })
    school: string | null;

    @ApiProperty({ required: false, nullable: true })
    work: string | null;

    @ApiProperty({ required: false, nullable: true })
    website: string | null;

}
