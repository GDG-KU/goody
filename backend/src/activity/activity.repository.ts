import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateActivityData } from './type/create-activity-data.type';
import { ActivityData } from './type/activity-data.type';
import { User, Activity, ActivityKeyword } from '@prisma/client';
import { ActivityQuery } from './query/activity.query';
import { UpdateActivityData } from './type/update-activity-data.type';

@Injectable()
export class ActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createActivity(data: CreateActivityData): Promise<ActivityData> {
    return this.prisma.activity.create({
      data: {
        title: data.title,
        description: data.description,
        locationName: data.locationName,
        imageUrl: data.imageUrl,
        activityKeywords: {
          create: data.keywords.map((keywordId) => ({
            keywordId: keywordId,
          })),
        },
        userId: data.userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        locationName: true,
        imageUrl: true,
        activityKeywords: {
          select: {
            id: true,
            keywordId: true,
          },
        },
        userId: true,
      },
    });
  }

  async getMyActivitys(userId: number): Promise<ActivityData[]> {
    return this.prisma.activity.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        imageUrl: true,
        title: true,
        description: true,
        userId: true,
        locationName: true,
        activityKeywords: {
          select: {
            id: true,
            keywordId: true,
          },
        },
      },
    });
  }
  async getActivityByActivityId(
    activityId: number,
  ): Promise<ActivityData | null> {
    return this.prisma.activity.findUnique({
      where: {
        id: activityId,
      },
      select: {
        id: true,
        imageUrl: true,
        title: true,
        description: true,
        userId: true,
        locationName: true,
        activityKeywords: {
          select: {
            id: true,
            keywordId: true,
          },
        },
      },
    });
  }
  async createRecentActivity(
    activityId: number,
    userId: number,
  ): Promise<void> {
    await this.prisma.recentActivity.upsert({
      where: {
        userId_activityId: {
          userId,
          activityId,
        },
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        userId,
        activityId,
        viewedAt: new Date(),
      },
    });
  }

  async checkKeywordIdsValid(keywordIds: number[]): Promise<boolean> {
    const keyword = await this.prisma.keyword.findMany({
      where: {
        id: {
          in: keywordIds,
        },
      },
    });
    return keyword.length === keywordIds.length;
  }

  async getRecentActivities(userId: number): Promise<ActivityData[]> {
    const recentActivities = await this.prisma.recentActivity.findMany({
      where: { userId },
      orderBy: { viewedAt: 'desc' },
      take: 3,
      include: {
        activity: {
          include: {
            activityKeywords: {
              include: {
                keyword: true,
              },
            },
          },
        },
      },
    });
    return recentActivities.map((recent) => recent.activity);
  }

  async updateActivityImage(
    activityId: number,
    imageUrl: string,
  ): Promise<void> {
    await this.prisma.activity.update({
      where: { id: activityId },
      data: { imageUrl },
    });
  }
  async updateActivity(
    id: number,
    data: UpdateActivityData,
  ): Promise<ActivityData> {
    return this.prisma.activity.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        description: data.description,
        locationName: data.locationName,
        imageUrl: data.imageUrl,
        activityKeywords: data.keywords
          ? {
              deleteMany: {},
              createMany: {
                data: data.keywords.map((keywordId) => ({
                  keywordId,
                })),
              },
            }
          : undefined,
      },
      select: {
        id: true,
        title: true,
        description: true,
        locationName: true,
        imageUrl: true,
        userId: true,
        activityKeywords: {
          select: {
            id: true,
            keywordId: true,
          },
        },
      },
    });
  }
  async findKeywordsByIds(ids: number[]): Promise<ActivityKeyword[]> {
    return this.prisma.activityKeyword.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
