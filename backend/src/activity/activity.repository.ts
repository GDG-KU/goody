import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateEventData } from './type/create-activity-data.type';
import { EventData } from './type/activity-data.type';
import { User, Event, Category, City, EventJoin } from '@prisma/client';
import { EventQuery } from './query/activity.query';
import { UpdateEventData } from './type/update-activity-data.type';
import { UserBaseInfo } from 'src/auth/type/user-base-info.type';

@Injectable()
export class EventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(data: CreateEventData): Promise<EventData> {
    return this.prisma.event.create({
      data: {
        hostId: data.hostId,
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        startTime: data.startTime,
        endTime: data.endTime,
        maxPeople: data.maxPeople,
        eventJoin: {
          create: {
            userId: data.hostId,
          },
        },
        eventCity: {
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
        eventCity: {
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
  async getMyEvents(userId: number): Promise<EventData[]> {
    return this.prisma.event.findMany({
      where: {
        eventJoin: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        hostId: true,
        title: true,
        description: true,
        categoryId: true,
        eventCity: {
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

  async getCityIdsByEventId(eventId: number): Promise<number[]> {
    const eventCity = await this.prisma.eventCity.findMany({
      where: {
        eventId: eventId,
      },
    });

    return eventCity.map((city) => city.cityId);
  }

  async isEventExist(id: number): Promise<boolean> {
    const event = await this.prisma.event.findUnique({
      where: {
        id: id,
      },
    });

    return !!event;
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

  async isUserJoinedEvent(userId: number, eventId: number): Promise<boolean> {
    const event = await this.prisma.eventJoin.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
        user: {
          deletedAt: null,
        },
      },
    });

    return !!event;
  }
  async joinEvent(eventId: number, userId: number): Promise<void> {
    await this.prisma.eventJoin.create({
      data: {
        eventId,
        userId,
      },
      select: {
        id: true,
        eventId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  async getEventJoin(id: number): Promise<EventJoin | null> {
    return this.prisma.eventJoin.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        eventId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getEventJoinCount(eventId: number): Promise<number> {
    return this.prisma.eventJoin.count({
      where: {
        eventId,
      },
    });
  }

  async outEvent(eventId: number, userId: number): Promise<void> {
    await this.prisma.eventJoin.delete({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });
  }

  async getEventById(id: number): Promise<EventData | null> {
    return this.prisma.event.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        hostId: true,
        title: true,
        description: true,
        categoryId: true,
        eventCity: {
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

  async getEvents(query: EventQuery): Promise<EventData[]> {
    return this.prisma.event.findMany({
      where: {
        hostId: query.hostId,
        categoryId: query.categoryId,
        ...(query.cityId && { eventCity: { some: { cityId: query.cityId } } }),
      },
      select: {
        id: true,
        hostId: true,
        title: true,
        description: true,
        categoryId: true,
        eventCity: {
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

  async updateEvent(
    eventId: number,
    data: UpdateEventData,
  ): Promise<EventData> {
    return this.prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        startTime: data.startTime,
        endTime: data.endTime,
        maxPeople: data.maxPeople,
        ...(data.cityIds !== undefined && {
          eventCity: {
            updateMany: {
              where: {
                eventId: eventId,
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
        eventCity: {
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

  async deleteEvent(eventId: number): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.eventJoin.deleteMany({
        where: {
          eventId: eventId,
        },
      }),
      this.prisma.eventCity.deleteMany({
        where: {
          eventId: eventId,
        },
      }),
      this.prisma.event.delete({
        where: {
          id: eventId,
        },
      }),
    ]);
  }
}
