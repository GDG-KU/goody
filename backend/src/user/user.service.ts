import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';
import { UserBaseInfo } from 'src/auth/type/user-base-info.type';
import { PatchUpdateUserPayload } from './payload/patch-update-user.payload';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserInfoById(userId: number, user: UserBaseInfo): Promise<UserDto> {
    if (userId !== user.userId) {
      throw new NotFoundException('해당 권한이 없습니다.');
    }

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

    if (userId !== user.userId) {
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
}
