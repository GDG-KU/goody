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
}
/*
  async getActivityByActivityId(activityId: number): Promise<ActivityDto> {
    const activity = await this.activityRepository.getActivityById(activityId);

    if (!activity) {
      throw new NotFoundException('activity가 존재하지 않습니다.');
    }

    return ActivityDto.from(activity);
  }

  async getActivitys(query: ActivityQuery): Promise<ActivityListDto> {
    const activitys = await this.activityRepository.getActivitys(query);

    return ActivityListDto.from(activitys);
  }

  async joinActivity(activityId: number, user: UserBaseInfo): Promise<void> {
    const isUserJoinedActivity = await this.activityRepository.isUserJoinedActivity(
      user.id,
      activityId,
    );

    if (isUserJoinedActivity) {
      throw new ConflictException('해당 유저가 이미 참가한 이벤트입니다.');
    }

    const activity = await this.activityRepository.getActivityById(activityId);

    if (!activity) {
      throw new NotFoundException('Activity가 존재하지 않습니다.');
    }

    if (activity.endTime < new Date()) {
      throw new ConflictException('이미 시작된 이벤트는 참가할 수 없습니다.');
    }

    const currentPeople = await this.activityRepository.getActivityJoinCount(activityId);

    if (activity.maxPeople == currentPeople) {
      throw new ConflictException('이미 정원이 다 찼습니다.');
    }

    await this.activityRepository.joinActivity(activityId, user.id);
  }

  async outActivity(activityId: number, user: UserBaseInfo): Promise<void> {
    const isUserJoinedActivity = await this.activityRepository.isUserJoinedActivity(
      user.id,
      activityId,
    );

    if (!isUserJoinedActivity) {
      throw new ConflictException('해당 유저가 참가하지 않은 이벤트입니다.');
    }

    const activity = await this.activityRepository.getActivityById(activityId);
    if (!activity) {
      throw new NotFoundException('Activity가 존재하지 않습니다.');
    }

    if (activity.hostId === user.id) {
      throw new ConflictException('host는 이벤트에서 나갈 수 없습니다.');
    }

    if (activity.startTime < new Date()) {
      throw new ConflictException('이미 시작된 이벤트는 나갈 수 없습니다.');
    }

    await this.activityRepository.outActivity(activityId, user.id);
  }

  async putUpdateActivity(
    activityId: number,
    payload: PutUpdateActivityPayload,
    user: UserBaseInfo,
  ): Promise<ActivityDto> {
    const activity = await this.activityRepository.getActivityById(activityId);

    if (!activity) {
      throw new NotFoundException('Activity가 존재하지 않습니다.');
    }

    const updateData: UpdateActivityData = {
      title: payload.title,
      description: payload.description,
      categoryId: payload.categoryId,
      cityIds: payload.cityIds,
      startTime: payload.startTime,
      endTime: payload.endTime,
      maxPeople: payload.maxPeople,
    };

    const category = await this.activityRepository.getCategoryById(
      payload.categoryId,
    );

    if (!category) {
      throw new NotFoundException('category가 존재하지 않습니다.');
    }

    const cityValidity = await this.activityRepository.isCityIdsValid(
      payload.cityIds,
    );

    if (!cityValidity) {
      throw new NotFoundException('존재하지 않는 city가 포함되어 있습니다.');
    }

    if (activity.startTime < new Date()) {
      throw new ConflictException('이미 시작된 이벤트는 수정할 수 없습니다.');
    }

    if (payload.startTime > payload.endTime) {
      throw new ConflictException(
        '시작 시간이 끝나는 시간보다 늦게 수정할 수 없습니다.',
      );
    }
    if (payload.startTime < new Date()) {
      throw new ConflictException(
        '시작 시간이 현재 시간보다 빠르게 수정할 수 없습니다.',
      );
    }
    const activityJoinCount =
      await this.activityRepository.getActivityJoinCount(activityId);

    if (payload.maxPeople < activityJoinCount) {
      throw new ConflictException(
        '정원을 현재 참가자 수보다 작게 수정할 수 없습니다.',
      );
    }

    await this.checkHostPermissionOfActivity(activityId, user.id);

    const updatedActivity = await this.activityRepository.updateActivity(
      activityId,
      updateData,
    );

    return ActivityDto.from(updatedActivity);
  }

  async patchUpdateActivity(
    activityId: number,
    payload: PatchUpdateActivityPayload,
    user: UserBaseInfo,
  ): Promise<ActivityDto> {
    if (payload.title === null) {
      throw new BadRequestException('title은 null이 될 수 없습니다.');
    }
    if (payload.description === null) {
      throw new BadRequestException('description은 null이 될 수 없습니다.');
    }
    if (payload.categoryId === null) {
      throw new BadRequestException('categoryId은 null이 될 수 없습니다.');
    }
    if (payload.cityIds === null) {
      throw new BadRequestException('cityId은 null이 될 수 없습니다.');
    }
    if (payload.startTime === null) {
      throw new BadRequestException('startTime은 null이 될 수 없습니다.');
    }
    if (payload.endTime === null) {
      throw new BadRequestException('endTime은 null이 될 수 없습니다.');
    }
    if (payload.maxPeople === null) {
      throw new BadRequestException('maxPeople은 null이 될 수 없습니다.');
    }

    await this.checkHostPermissionOfActivity(activityId, user.id);

    const activity = await this.activityRepository.getActivityById(activityId);

    if (!activity) {
      throw new NotFoundException('Activity가 존재하지 않습니다.');
    }

    const updateData: UpdateActivityData = {
      title: payload.title,
      description: payload.description,
      categoryId: payload.categoryId,
      cityIds: payload.cityIds,
      startTime: payload.startTime,
      endTime: payload.endTime,
      maxPeople: payload.maxPeople,
    };

    if (activity.startTime < new Date()) {
      throw new ConflictException('이미 시작된 이벤트는 수정할 수 없습니다.');
    }

    if (
      payload.startTime &&
      payload.endTime &&
      payload.startTime > payload.endTime
    ) {
      throw new ConflictException(
        '시작 시간이 끝나는 시간보다 늦게 수정할 수 없습니다.',
      );
    }
    if (
      !payload.startTime &&
      payload.endTime &&
      payload.endTime < activity.startTime
    ) {
      throw new ConflictException(
        '시작 시간이 현재 시간보다 빠르게 수정할 수 없습니다.',
      );
    }
    if (
      payload.startTime &&
      !payload.endTime &&
      payload.startTime > activity.endTime
    ) {
      throw new ConflictException(
        '시작 시간이 현재 시간보다 빠르게 수정할 수 없습니다.',
      );
    }
    const activityJoinCount =
      await this.activityRepository.getActivityJoinCount(activityId);

    if (payload.maxPeople && payload.maxPeople < activityJoinCount) {
      throw new ConflictException(
        '정원을 현재 참가자 수보다 작게 수정할 수 없습니다.',
      );
    }

    if (payload.categoryId) {
      const category = await this.activityRepository.getCategoryById(
        payload.categoryId,
      );

      if (!category) {
        throw new NotFoundException('category가 존재하지 않습니다.');
      }
    }

    if (payload.cityIds) {
      const cityValidity = await this.activityRepository.isCityIdsValid(
        payload.cityIds,
      );
      if (!cityValidity) {
        throw new NotFoundException('존재하지 않는 city가 포함되어 있습니다.');
      }
    }

    const updatedActivity = await this.activityRepository.updateActivity(
      activityId,
      updateData,
    );

    return ActivityDto.from(updatedActivity);
  }

  async deleteActivity(activityId: number, user: UserBaseInfo): Promise<void> {
    const activity = await this.activityRepository.getActivityById(activityId);

    if (!activity) {
      throw new NotFoundException('Activity가 존재하지 않습니다.');
    }

    if (activity.startTime < new Date()) {
      throw new ConflictException('이미 시작된 이벤트는 삭제할 수 없습니다.');
    }

    await this.checkHostPermissionOfActivity(activityId, user.id);

    await this.activityRepository.deleteActivity(activityId);
  }

  private async checkHostPermissionOfActivity(activityId: number, userId: number) {
    const activity = await this.activityRepository.getActivityById(activityId);

    if (!activity) {
      throw new NotFoundException('Activity가 존재하지 않습니다.');
    }

    if (activity.hostId !== userId) {
      throw new ForbiddenException('호스트가 아닙니다!');
    }
  }
}
  */
