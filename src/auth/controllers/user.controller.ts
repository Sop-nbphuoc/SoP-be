import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { map, Observable } from 'rxjs';
import { User } from '../entities/user.entity'; 
import { UserService } from '../service/user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('profile/:id')
    findUserById(@Param('id') id: string): Observable<User> {
        return this.userService.findUserById(id);
    }
    
    @Get('my')
    findMyProfile(@Body() user: User): Observable<User> {
        return this.userService.findUserById(user.id);
    }
    
    
}