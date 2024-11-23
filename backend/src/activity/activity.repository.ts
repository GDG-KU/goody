import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateActivityData } from './type/create-activity-data.type';
import { ActivityData } from './type/activity-data.type';
import { User, Activity, Category, City, ActivityJoin } from '@prisma/client';
import { ActivityQuery } from './query/activity.query';
import { UpdateActivityData } from './type/update-activity-data.type';
import { UserBaseInfo } from 'src/auth/type/user-base-info.type';

@Injectable()
export class ActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createActivity(data: CreateActivityData): Promise<ActivityData> {
    return this.prisma.activity.create({
      data: {
        hostId: data.hostId,
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        startTime: data.startTime,
        endTime: data.endTime,
        maxPeople: data.maxPeople,
        activityJoin: {
          create: {
            userId: data.hostId,
          },
        },
        activityCity: {
          create: data.cityIds.map((cityId) => ({
            cityId: cityId,
          })),
        },
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
  async getMyActivitys(userId: number): Promise<ActivityData[]> {
    return this.prisma.activity.findMany({
      where: {
        userId: userId,
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

  async getUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
        deletedAt: null,
      },
    });
  }

  async getCategoryById(categoryId: number): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
  }

  async getCityById(cityId: number): Promise<City | null> {
    return this.prisma.city.findUnique({
      where: {
        id: cityId,
      },
    });
  }

  async getCityIdsByActivityId(activityId: number): Promise<number[]> {
    const activityCity = await this.prisma.activityCity.findMany({
      where: {
        activityId: activityId,
      },
    });

    return activityCity.map((city) => city.cityId);
  }

  async isActivityExist(id: number): Promise<boolean> {
    const activity = await this.prisma.activity.findUnique({
      where: {
        id: id,
      },
    });

    return !!activity;
  }
  async isUserInClub(userId: number, clubId: number): Promise<boolean> {
    const userInClub = await this.prisma.clubJoin.findUnique({
      where: {
        clubId_userId: {
          clubId,
          userId,
        },
        user: {
          deletedAt: null,
        },
      },
    });

    return !!userInClub;
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
