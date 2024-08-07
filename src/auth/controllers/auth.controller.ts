import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { map, Observable } from 'rxjs';
import { User } from '../entities/user.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() user: User): Observable<User> {
    return this.authService.registerAccount(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: User): Observable<{ accessToken: string, refreshToken: string }> {
    return this.authService.login(user);
  }

  // @Get('refresh')
  // refresh(@Body() user: User): Observable<{ accessToken: string, refreshToken: string }> {
    // return this.authService.refresh(user);
  // }


}
