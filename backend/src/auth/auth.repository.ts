import { PrismaService } from '../common/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserBaseInfo } from './type/user-base-info.type';
import { Keyword } from '@prisma/client';
import { SignUpData } from './type/sign-up-data.type';
import { UpdateUserData } from './type/update-user-data.type';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: SignUpData): Promise<UserBaseInfo> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        userName: data.userName,
        birthday: data.birthday,
      },
      select: {
        id: true,
        email: true,
        password: true,
        userName: true,
        birthday: true,
        profileImage: true,
        refreshToken: true,
      },
    });
  }

  async updateUser(id: number, data: UpdateUserData): Promise<UserBaseInfo> {
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email: data.email,
        password: data.password,
        userName: data.userName,
        birthday: data.birthday,
        profileImage: data.profileImage,
        refreshToken: data.refreshToken,
      },
      select: {
        id: true,
        email: true,
        password: true,
        userName: true,
        birthday: true,
        profileImage: true,
        refreshToken: true,
      },
    });
  }

  async getUserById(id: number): Promise<UserBaseInfo | null> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        password: true,
        userName: true,
        birthday: true,
        profileImage: true,
        refreshToken: true,
      },
    });
  }

  async getUserByEmail(email: string): Promise<UserBaseInfo | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        userName: true,
        birthday: true,
        profileImage: true,
        refreshToken: true,
      },
    });
  }

  async getKeywordById(id: number): Promise<Keyword | null> {
    return this.prisma.keyword.findUnique({
      where: {
        id,
      },
    });
  }
}
