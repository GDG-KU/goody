import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivityRepository } from './activity.repository';
import { CreateActivityPayload } from './payload/create-activity.payload';
import { ActivityDto, ActivityListDto } from './dto/activity.dto';
import { CreateActivityData } from './type/create-activity-data.type';
import { ActivityQuery } from './query/activity.query';
import { UpdateActivityData } from './type/update-activity-data.type';
import { PatchUpdateActivityPayload } from './payload/patch-update-activity.payload';
import { PutUpdateActivityPayload } from './payload/put-update-activity.payload';
import { UserBaseInfo } from 'src/auth/type/user-base-info.type';
import { get } from 'lodash';

@Injectable()
export class ActivityService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async createActivity(
    payload: CreateActivityPayload,
    user: UserBaseInfo,
  ): Promise<ActivityDto> {
    const createData: CreateActivityData = {
      userId: user.id,
      title: payload.title,
      description: payload.description,
      locationName: payload.locationName,
      keywords: payload.keywords,
      imageUrl: payload.imageUrl,
      latitude: payload.latitude,
      longitude: payload.longitude,
    };
    const checkKeyword = await this.activityRepository.checkKeywordIdsValid(
      payload.keywords,
    );
    if (!checkKeyword) {
      throw new BadRequestException('키워드가 존재하지 않습니다.');
    }

    const activity = await this.activityRepository.createActivity(createData);

    return ActivityDto.from(activity);
  }

  async getMyActivitys(user: UserBaseInfo): Promise<ActivityListDto> {
    const activitys = await this.activityRepository.getMyActivitys(user.id);

    return ActivityListDto.from(activitys);
  }
  async getRecentActivities(user: UserBaseInfo): Promise<ActivityListDto> {
    const activitys = await this.activityRepository.getRecentActivities(
      user.id,
    );

    return ActivityListDto.from(activitys);
  }

  async getActivityByActivityId(
    activityId: number,
    user: UserBaseInfo,
  ): Promise<ActivityDto> {
    const activity =
      await this.activityRepository.getActivityByActivityId(activityId);

    if (!activity) {
      throw new NotFoundException('activity가 존재하지 않습니다.');
    }
    await this.activityRepository.createRecentActivity(activityId, user.id);

    return ActivityDto.from(activity);
  }

  async updateActivityImage(
    activityId: number,
    imageUrl: string,
    userId: number,
  ): Promise<void> {
    const activity =
      await this.activityRepository.getActivityByActivityId(activityId);
    if (!activity) {
      throw new NotFoundException('해당 활동이 존재하지 않습니다.');
    }
    if (activity.userId !== userId) {
      throw new ForbiddenException(
        '이 활동의 이미지를 수정할 권한이 없습니다.',
      );
    }
    await this.activityRepository.updateActivityImage(activityId, imageUrl);
  }

  async patchUpdateActivity(
    activityId: number,
    payload: PatchUpdateActivityPayload,
    user: UserBaseInfo,
  ): Promise<ActivityDto> {
    const data = this.validateNullOf(payload);

    const activity =
      await this.activityRepository.getActivityByActivityId(activityId);

    if (!activity) {
      throw new NotFoundException('Activity를 찾을 수 없습니다.');
    }
    if (activity.userId !== user.id) {
      throw new ForbiddenException('올린 본인만 수정할 수 있습니다.');
    }
    if (payload.keywords) {
      const keywords = await this.activityRepository.findKeywordsByIds(
        payload.keywords,
      );
      if (keywords.length !== payload.keywords.length) {
        throw new NotFoundException(
          '존재하지 않는 keyword가 포함되어 있습니다.',
        );
      }
    }
    /* 일단 이정도만 할께 더 생각이 안난다 딱히 제약조건이랄게 좀 적어서 event에비해서*/
    const updatedActivity = await this.activityRepository.updateActivity(
      activityId,
      data,
    );

    return ActivityDto.from(updatedActivity);
  }

  async getNearestActivities(
    longitude: number,
    latitude: number,
  ): Promise<ActivityListDto> {
    const activities = await this.activityRepository.getNearestActivities(
      longitude,
      latitude,
    );

    return ActivityListDto.from(activities);
  }

  private validateNullOf(
    payload: PatchUpdateActivityPayload,
  ): UpdateActivityData {
    if (payload.title === null) {
      throw new BadRequestException('title은 null이 될 수 없습니다.');
    }
    if (payload.description === null) {
      throw new BadRequestException('description은 null이 될 수 없습니다.');
    }
    if (payload.locationName === null) {
      throw new BadRequestException('locationName은 null이 될 수 없습니다.');
    }
    if (payload.keywords === null) {
      throw new BadRequestException('keywords은 null이 될 수 없습니다.');
    }

    return {
      title: payload.title,
      description: payload.description,
      locationName: payload.locationName,
      keywords: payload.keywords,
    };
  }
}
