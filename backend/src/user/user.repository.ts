import { PrismaService } from '../common/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserData } from './type/user-data.type';
import { UserBaseInfo } from 'src/auth/type/user-base-info.type';
import { UpdateUserData } from './type/update-user-data.type';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        userId: userId,
      },
    });
  }

  async isEmailUnique(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user === null;
  }
  async isUserNameUnique(userName: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        userName: userName,
      },
    });

    return user === null;
  }

  async getUserInfoById(userId: number): Promise<UserData | null> {
    return this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        userId: true,
        email: true,
        userName: true,
        birthday: true,
        profileImage: true,
      },
    });
  }

  async updateUser(userId: number, data: UpdateUserData): Promise<UserData> {
    return this.prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        email: data.email,
        userName: data.userName,
        birthday: data.birthday,
        profileImage: data.profileImage,
      },
      select: {
        userId: true,
        email: true,
        userName: true,
        birthday: true,
        profileImage: true,
      },
    });
  }
}
