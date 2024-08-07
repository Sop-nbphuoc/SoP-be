import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2'
import { User, UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from, map, Observable, of, switchMap, tap, catchError, forkJoin } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>,
  private configService: ConfigService,
  private jwtService: JwtService) {}

  hashPassword(password: string): Observable<string> {
    return from(argon2.hash(password));
  }

  doesUserExist(email: string): Observable<boolean> {
    return from(this.userRepository.findOne({
      where: { email: email },
    })).pipe(
      switchMap((user: User) => {
        return of(!!user);
      }),
    );
  }
  
  registerAccount(createUserDto: User): Observable<User> {
    const { password, email, name } = createUserDto;

    return this.doesUserExist(email).pipe(
      tap((doesUserExist: boolean) => {
        if (doesUserExist)
          throw new HttpException(
            'A user has already been created with this email address',
            HttpStatus.BAD_REQUEST,
          );
      }),
      switchMap(() => {
        return this.hashPassword(password).pipe(
          switchMap((hashedPassword: string) => {
            return from(this.userRepository.save({
              email,
              password: hashedPassword,
              name,
            })).pipe(
              map((user: User) => {
                delete user.password;
                return user;
              }),
            );
          }),
        );
      
      }),
    );
  }

  validateUser(email: string, password: string): Observable<User> {
    return from(
      this.userRepository.findOne({ 
        where: {
          email:email
        },
        select: ['id', 'email', 'password', 'name'],
      },
    ),
    ).pipe(
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
            }
          }),
        );
      }),
    );
  }
  
  login(user: User): Observable<{ accessToken: string, refreshToken: string }> {
    const { email, password } = user;
    return this.validateUser(email, password).pipe(
      switchMap((user: User) => {
        if (user) {
          // create JWT - credentials
          return from(this.getTokens(user));
        }
      }),
    );
  }

  getTokens(user: User): Observable<{ accessToken: string, refreshToken: string }> {
    return forkJoin([
      of(this.jwtService.sign(
        {
          user
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15y' // !!!! nhớ đổi lại
        })),
      of(this.jwtService.sign(
        {
          user
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d'
        }))
    ]).pipe( map(([ accessToken, refreshToken ]) => {
      return {
        accessToken,
        refreshToken
      }
    }
    ));
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
