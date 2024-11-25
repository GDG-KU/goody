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
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { UserBaseInfo } from 'src/auth/type/user-base-info.type';
import { PatchUpdateUserPayload } from './payload/patch-update-user.payload';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  editFileName,
  imageFileFilter,
} from 'src/common/utils/file-upload.utils';
import { UserData } from './type/user-data.type';
@Controller('users')
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

  @Post(':userId')
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
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: './uploads/profile-images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiOkResponse({ type: UserDto })
  async updateProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<void> {
    await this.userService.updateProfileImage(user, file);
  }
}
