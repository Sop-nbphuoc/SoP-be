import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty(
        {
            example:'phuoc@mail.com'
        }
    )
    @IsEmail()
    email: string;

    @ApiProperty(
        {
            example:'123456'
        }
    )
    @IsString()
    @IsNotEmpty()
    password: string;
}