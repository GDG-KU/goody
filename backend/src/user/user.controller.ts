import {
  Controller,
  Delete,
  HttpCode,
  Param,
  Get,
  Body,
  ParseIntPipe,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { UserBaseInfo } from 'src/auth/type/user-base-info.type';
import { PatchUpdateUserPayload } from './payload/patch-update-user.payload';
import { ProfileImageUpdatePayload } from './payload/profile-update-image-user.payload';
import { UserData } from './type/user-data.type';
@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '유저 정보 조회' })
  @ApiOkResponse({ type: UserDto })
  async getUserInfoById(@CurrentUser() user: UserBaseInfo): Promise<UserDto> {
    return this.userService.getUserInfoById(user);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '유저 정보 수정' })
  @ApiOkResponse({ type: UserDto })
  async PatchUpdateUser(
    @Body() payload: PatchUpdateUserPayload,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<UserDto> {
    return this.userService.PatchUpdateUser(user.id, payload, user);
  }

  @Post(':userId/profile-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '프로필 이미지 수정' })
  @ApiOkResponse({ type: UserDto })
  async updateProfileImage(
    @Param('profileImage') imageUrl: string,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<void> {
    await this.userService.updateProfileImage(user, imageUrl);
  }
}
