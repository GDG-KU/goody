import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ActivityDto, ActivityListDto } from './dto/activity.dto';
import { CreateActivityPayload } from './payload/create-activity.payload';
import { ActivityQuery } from './query/activity.query';
import { PatchUpdateActivityPayload } from './payload/patch-update-activity.payload';
import { PutUpdateActivityPayload } from './payload/put-update-activity.payload';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { UserBaseInfo } from 'src/auth/type/user-base-info.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  editFileName,
  imageFileFilter,
} from 'src/common/utils/file-upload.utils';

@Controller('activities')
@ApiTags('Activity API')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  /*
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '낭만 활동을 생성합니다' })
  @ApiCreatedResponse({ type: ActivityDto })
  async createActivity(
    @Body() payload: CreateActivityPayload,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<ActivityDto> {
    return this.activityService.createActivity(payload, user);
  }*/

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/activity-images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '활동 생성 데이터',
    type: CreateActivityPayload,
  })
  async createActivity(
    @UploadedFile() file: Express.Multer.File,
    @Body() createActivityPayload: CreateActivityPayload,
    @CurrentUser() user: UserBaseInfo,
  ) {
    const imageUrl = `/uploads/activity-images/${file.filename}`;
    return this.activityService.createActivity(
      createActivityPayload,
      imageUrl,
      user,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내가 만든 낭만 활동 정보를 가져옵니다' })
  @ApiOkResponse({ type: ActivityListDto })
  async getMyActivitys(
    @CurrentUser() user: UserBaseInfo,
  ): Promise<ActivityListDto> {
    return this.activityService.getMyActivitys(user);
  }

  @Get(':activityId/recents')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '최근 활동 3개를 가져옵니다' })
  @ApiOkResponse({ type: ActivityListDto })
  async getRecentActivitys(
    @CurrentUser() user: UserBaseInfo,
  ): Promise<ActivityListDto> {
    return this.activityService.getRecentActivities(user);
  }

  @Get(':activityId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '낭만활동 상세 정보를 가져옵니다' })
  @ApiOkResponse({ type: ActivityDto })
  async getActivityById(
    @Param('activityId', ParseIntPipe) activityId: number,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<ActivityDto> {
    return this.activityService.getActivityByActivityId(activityId, user);
  }

  /*

  @Get()
  @ApiOperation({ summary: '여러 모임 정보를 가져옵니다' })
  @ApiOkResponse({ type: ActivityListDto })
  async getActivitys(@Query() query: ActivityQuery): Promise<ActivityListDto> {
    return this.eventService.getActivitys(query);
  }

  @Post(':eventId/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '모임에 참가합니다' })
  @ApiNoContentResponse()
  async joinActivity(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<void> {
    return this.eventService.joinActivity(eventId, user);
  }

  @Post(':eventId/out')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '유저를 event에서 내보냅니다.' })
  @ApiNoContentResponse()
  async outActivity(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<void> {
    return this.eventService.outActivity(eventId, user);
  }

  @Patch(':eventId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '모임을 수정합니다' })
  @ApiOkResponse({ type: ActivityDto })
  async patchUpdateActivity(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() payload: PatchUpdateActivityPayload,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<ActivityDto> {
    return this.eventService.patchUpdateActivity(eventId, payload, user);
  }

  @Put(':eventId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '모임을 수정합니다' })
  @ApiOkResponse({ type: ActivityDto })
  async putUpdateActivity(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() payload: PutUpdateActivityPayload,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<ActivityDto> {
    return this.eventService.putUpdateActivity(eventId, payload, user);
  }

  @Delete(':eventId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({ summary: '모임을 삭제합니다.' })
  @ApiNoContentResponse()
  async deleteActivity(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<void> {
    return this.eventService.deleteActivity(eventId, user);
  }
*/
}
