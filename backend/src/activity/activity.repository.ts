import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateActivityData } from './type/create-activity-data.type';
import { ActivityData } from './type/activity-data.type';
import { User, Activity } from '@prisma/client';
import { ActivityQuery } from './query/activity.query';
import { UpdateActivityData } from './type/update-activity-data.type';
import { UserBaseInfo } from 'src/auth/type/user-base-info.type';

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
}
/*

  async getUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });
  }




  async isActivityExist(id: number): Promise<boolean> {
    const activity = await this.prisma.activity.findUnique({
      where: {
        activityId: id,
      },
    });

    return !!activity;
  }
 

  async isUserJoinedActivity(
    userId: number,
    activityId: number,
  ): Promise<boolean> {
    const activity = await this.prisma.activityJoin.findUnique({
      where: {
        activityId_userId: {
          activityId,
          userId,
        },
        user: {
          deletedAt: null,
        },
      },
    });

    return !!activity;
  }
  async joinActivity(activityId: number, userId: number): Promise<void> {
    await this.prisma.activityJoin.create({
      data: {
        activityId,
        userId,
      },
      select: {
        id: true,
        activityId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  async getActivityJoin(id: number): Promise<ActivityJoin | null> {
    return this.prisma.activityJoin.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        activityId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getActivityJoinCount(activityId: number): Promise<number> {
    return this.prisma.activityJoin.count({
      where: {
        activityId,
      },
    });
  }

  async outActivity(activityId: number, userId: number): Promise<void> {
    await this.prisma.activityJoin.delete({
      where: {
        activityId_userId: {
          activityId,
          userId,
        },
      },
    });
  }

  async getActivityById(id: number): Promise<ActivityData | null> {
    return this.prisma.activity.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        hostId: true,
        title: true,
        description: true,
        categoryId: true,
        activityCity: {
          select: {
            id: true,
            cityId: true,
          },
        },
        club: {
          select: {
            id: true,
          },
        },
        startTime: true,
        endTime: true,
        maxPeople: true,
      },
    });
  }

  async getActivitys(query: ActivityQuery): Promise<ActivityData[]> {
    return this.prisma.activity.findMany({
      where: {
        hostId: query.hostId,
        categoryId: query.categoryId,
        ...(query.cityId && {
          activityCity: { some: { cityId: query.cityId } },
        }),
      },
      select: {
        id: true,
        hostId: true,
        title: true,
        description: true,
        categoryId: true,
        activityCity: {
          select: {
            id: true,
            cityId: true,
          },
        },
        club: {
          select: {
            id: true,
          },
        },
        startTime: true,
        endTime: true,
        maxPeople: true,
      },
    });
  }

  async updateActivity(
    activityId: number,
    data: UpdateActivityData,
  ): Promise<ActivityData> {
    return this.prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        startTime: data.startTime,
        endTime: data.endTime,
        maxPeople: data.maxPeople,
        ...(data.cityIds !== undefined && {
          activityCity: {
            updateMany: {
              where: {
                activityId: activityId,
              },
              data: data.cityIds.map((cityId) => ({
                cityId: cityId,
              })),
            },
          },
        }),
      },
      select: {
        id: true,
        hostId: true,
        title: true,
        description: true,
        categoryId: true,
        activityCity: {
          select: {
            id: true,
            cityId: true,
          },
        },
        club: {
          select: {
            id: true,
          },
        },
        startTime: true,
        endTime: true,
        maxPeople: true,
      },
    });
  }

  async isCityIdsValid(cityIds: number[]): Promise<boolean> {
    const city = await this.prisma.city.findMany({
      where: {
        id: {
          in: cityIds,
        },
      },
    });
    return city.length === cityIds.length;
  }

  async deleteActivity(activityId: number): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.activityJoin.deleteMany({
        where: {
          activityId: activityId,
        },
      }),
      this.prisma.activityCity.deleteMany({
        where: {
          activityId: activityId,
        },
      }),
      this.prisma.activity.delete({
        where: {
          id: activityId,
        },
      }),
    ]);
  }
}
  */
