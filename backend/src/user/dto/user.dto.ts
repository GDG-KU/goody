import { ApiProperty } from '@nestjs/swagger';
import { from } from 'form-data';
import { UserData } from '../type/user-data.type';
export class UserDto {
  @ApiProperty({
    description: '유저 ID',
    type: Number,
  })
  userId!: number;

  @ApiProperty({
    description: '유저 이름',
    type: String,
  })
  userName!: string;

  @ApiProperty({
    description: '유저 이메일',
    type: String,
  })
  email!: string;

  @ApiProperty({
    description: '유저 생일',
    type: Date,
    nullable: true,
  })
  birthday!: Date | null;

  static from(user: UserData): UserDto {
    return {
      userId: user.userId,
      userName: user.userName,
      email: user.email,
      birthday: user.birthday,
    };
  }

  static fromArray(users: UserData[]): UserDto[] {
    return users.map((user) => UserDto.from(user));
  }
}

export class UserListDto {
  @ApiProperty({
    description: '유저 목록',
    type: [UserDto],
  })
  users!: UserDto[];

  static from(users: UserData[]): UserListDto {
    return {
      users: UserDto.fromArray(users),
    };
  }
}
