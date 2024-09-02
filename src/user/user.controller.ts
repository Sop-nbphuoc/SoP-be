import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req, Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { map, Observable } from 'rxjs';
import { User } from './entities/user.entity'; 
import { UserService } from './user.service';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/auth/guards/jwt_payload.interface';


@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    private logger = new Logger('Main')

    @Get('profile/:id')
    findUserById(@Param('id') id: string): Observable<User> {
        return this.userService.findUserById(id);
    }
    
    
    @Get('my')
    findMyProfile(@Req() req: RequestWithUser): Observable<User> {
        this.logger.log(req.user)
        return this.userService.findUserById(req.user.id);
    }
    
    
}