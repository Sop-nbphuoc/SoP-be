import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2'
import { User, UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>,) {}

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
  
  createUser(createUserDto: User): Observable<User> {
    const { password, email, name } = createUserDto;

    return this.doesUserExist(email).pipe(
      tap((doesUserExist: boolean) => {
        if (doesUserExist)
          throw new HttpException(
            'A user has already been created with this email address',
            HttpStatus.BAD_REQUEST,
          );
      }),
      switchMap((userExists: boolean) => {
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

  // async findUserAuth(user: UserEtity) {
  //   const res = await this.prismaService.user.findUnique({
  //     where: { username: user.username },
  //   });

  //   if (!await argon2.verify(res.password, user.password)) {
  //     return { ...res, password: undefined };
  //   }
  // }
  

}
