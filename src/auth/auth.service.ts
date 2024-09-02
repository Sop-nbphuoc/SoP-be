import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';
import {
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
  catchError,
  forkJoin,
} from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { TokenPayload } from './guards/jwt_payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  private logger = new Logger('AuthService');

  hashPassword(password: string): Observable<string> {
    return from(argon2.hash(password));
  }

  registerAccount(newUser: User): Observable<User> {
    const { password, email, name } = newUser;

    return this.userService.doesUserExist(email).pipe(
      tap((doesUserExist: boolean) => {
        this.logger.log('before doesUserExist');
        if (doesUserExist)
          throw new HttpException(
            { status: HttpStatus.CONFLICT, error: 'User already exists' },
            HttpStatus.CONFLICT,
          );

        this.logger.log('after doesUserExist');
      }),
      switchMap(() => {
        this.logger.log('before hashPassword');
        return this.hashPassword(password).pipe(
          switchMap((hashedPassword: string) => {
            this.logger.log('after hashPassword');
            newUser.password = hashedPassword;
            return this.userService.createUser(newUser);
          }),
        );
      }),
    );
  }

  validateUser(email: string, password: string): Observable<User> {
    return from(this.userService.findUserByEmailForAuth(email)).pipe(
      switchMap((user: User) => {
        if (!user) {
          throw new HttpException(
            { status: HttpStatus.FORBIDDEN, error: 'Invalid Credentials' },
            HttpStatus.FORBIDDEN,
          );
        }
        return from(argon2.verify(user.password, password)).pipe(
          map((isValidPassword: boolean) => {
            if (isValidPassword) {
              delete user.password;
              return user;
            } else {
              throw new HttpException(
                { status: HttpStatus.FORBIDDEN, error: 'Invalid Credentials' },
                HttpStatus.FORBIDDEN,
              );
            }
          }),
        );
      }),
    );
  }

  login(user: User): Observable<{ token: TokenPayload; user: User }> {
    const { email, password } = user;
    return this.validateUser(email, password).pipe(
      switchMap((user: User) => {
        if (user) {
          // create JWT - credentials
          return this.getTokens(user).pipe(
            map((tokens: TokenPayload) => {
              return { token: tokens, user: user };
            }),
          );
        }
      }),
    );
  }

  getTokens(user: User): Observable<TokenPayload> {
    return forkJoin([
      of(
        this.jwtService.sign(
          {
            user,
          },
          {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: '15y', // !!!! nhớ đổi lại
          },
        ),
      ),
      of(
        this.jwtService.sign(
          {
            user,
          },
          {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
          },
        ),
      ),
    ]).pipe(
      map(([accessToken, refreshToken]) => {
        return {
          accessToken,
          refreshToken,
        };
      }),
    );
  }

  getJwtUser(jwt: string): Observable<User | null> {
    return from(this.jwtService.verifyAsync(jwt)).pipe(
      map(({ user }: { user: User }) => {
        return user;
      }),
      catchError(() => {
        return of(null);
      }),
    );
  }
}
