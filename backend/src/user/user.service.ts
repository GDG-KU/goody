import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';
import { UserBaseInfo } from 'src/auth/type/user-base-info.type';
import { PatchUpdateUserPayload } from './payload/patch-update-user.payload';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserInfoById(user: UserBaseInfo): Promise<UserDto> {
    return UserDto.from(user);
  }

  async PatchUpdateUser(
    userId: number,
    payload: PatchUpdateUserPayload,
    user: UserBaseInfo,
  ): Promise<UserDto> {
    if (payload.userName === null) {
      throw new BadRequestException('Name은 null이 될 수 없습니다.');
    }
    if (payload.email === null) {
      throw new BadRequestException('Email은 null이 될 수 없습니다.');
    }
    if (payload.birthday === null) {
      throw new BadRequestException('Birthday는 null이 될 수 없습니다.');
    }

    if (userId !== user.id) {
      throw new NotFoundException('해당 권한이 없습니다.');
    }

    if (payload.email !== user.email && payload.email !== undefined) {
      const isEmailUnique = await this.userRepository.isEmailUnique(
        payload.email,
      );
      if (!isEmailUnique) {
        throw new BadRequestException('이미 있는 Email입니다.');
      }
    }
    if (payload.userName !== user.userName && payload.userName !== undefined) {
      const isUserNameUnique = await this.userRepository.isUserNameUnique(
        payload.userName,
      );
      if (!isUserNameUnique) {
        throw new BadRequestException('이미 있는 UserName입니다.');
      }
    }

    const updateData = {
      email: payload.email,
      name: payload.userName,
      birthday: payload.birthday,
      profileImage: payload.profileImage,
    };

    const updatedUser = await this.userRepository.updateUser(
      userId,
      updateData,
    );

    return UserDto.from(updatedUser);
  }

  async updateProfileImage(
    user: UserBaseInfo,
    file: Express.Multer.File,
    imageUrl: string,
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException('프로필 이미지를 업로드하세요.');
    }

    await this.userRepository.updateProfileImage(user.id, imageUrl);
  }
}
