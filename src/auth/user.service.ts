import { Injectable } from '@nestjs/common';

// @Injectable()
// export class UserService {
//   constructor(private prismaService: PrismaService) {}

//   async findUserById(id: string) {
//     return this.prismaService.user.findUnique({
//       where: { id },
//     });
//   }

//   async getUsersProfile(username: string) {
//     return this.prismaService.user.findMany({
//       where: {
//         username,
//       },
//       include: {
//         _count: {
//           select: {
//             followers: true,
//             followings: true,
//             posts: true,
//           },
//         },
//       },
//     });
//   }

//   async updateUser(id: string, updateUserDto: Prisma.UserUpdateInput) {
//     return this.prismaService.user.update({
//       where: { id },
//       data: updateUserDto,
//     });
//   }

//   async deleteUser(id: string) {
//     return this.prismaService.user.delete({
//       where: { id },
//     });
//   }

// }
