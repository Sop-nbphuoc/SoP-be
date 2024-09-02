import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { map, Observable, tap } from 'rxjs';
import { User } from '../user/entities/user.entity';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private logger = new Logger('AuthController');

  @Post('register')
  register(@Body() user: RegisterDto, @Res() res: Response) {
    return this.authService.registerAccount(user).pipe(
      map(() =>
        res.status(HttpStatus.CREATED).json({
          message: 'User registered successfully!',
        }),
      ),
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: LoginDto, @Res() res: Response) {
    return this.authService.login(user).pipe(
      tap(({ token, user }) => {
        res.cookie('accessToken', token.accessToken, {
          httpOnly: true, // Bảo mật hơn, không cho phép JavaScript truy cập cookie
          secure: true, // Chỉ gửi cookie qua HTTPS
          maxAge: 1000 * 60 * 15, // Thời gian sống của cookie: 15 phút
          sameSite: 'strict', // Giúp ngăn chặn CSRF
        });

        res.cookie('refreshToken', token.refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 1000 * 60 * 60 * 24 * 7, // Thời gian sống của cookie: 7 ngày
          sameSite: 'strict',
        });

        //
      }),
      map(() =>
        res.status(HttpStatus.OK).json({
          user: user,
        }),
      ),
    );
  }

  // @Get('refresh')
  // refresh(@Body() user: User): Observable<{ accessToken: string, refreshToken: string }> {
  // return this.authService.refresh(user);
  // }
}
