import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2'
import { UserEtity } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async createUser(createUserDto: Prisma.UserCreateInput) {
    createUserDto.password = await argon2.hash(createUserDto.password);
    return this.prismaService.user.create({
      data: createUserDto,
    });
  }

  async findUserAuth(user: UserEtity) {
    const res = await this.prismaService.user.findUnique({
      where: { username: user.username },
    });

    if (!await argon2.verify(res.password, user.password)) {
      return { ...res, password: undefined };
    }
  }
  

}
