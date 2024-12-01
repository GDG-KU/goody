import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActivityData } from '../type/activity-data.type';
import { IsOptional } from 'class-validator';
import { ActivityLocationDto } from './activity-location.dto';

export class ActivityDto {
  @ApiProperty({
    description: 'activity ID',
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: '제목',
    type: String,
  })
  title!: string;

  @ApiProperty({
    description: '설명',
    type: String,
  })
  description!: string;

  @ApiProperty({
    description: '이미지 주소',
    type: String,
  })
  imageUrl!: string;

  @ApiProperty({
    description: '유저 ID',
    type: Number,
  })
  userId!: number;

  @ApiProperty({
    description: '키워드들',
    type: [Number],
  })
  keywords!: number[];

  @ApiProperty({
    description: '활동 위치',
    type: ActivityLocationDto,
    nullable: true,
  })
  location!: ActivityLocationDto | null;

  static from(activity: ActivityData): ActivityDto {
    return {
      id: activity.id,
      userId: activity.userId,
      title: activity.title,
      description: activity.description,
      imageUrl: activity.imageUrl,
      location: activity.activityLocation
        ? ActivityLocationDto.from(activity.activityLocation)
        : null,
      keywords: activity.activityKeywords.map((keyword) => keyword.keywordId),
    };
  }

  static fromArray(activities: ActivityData[]): ActivityDto[] {
    return activities.map((activity) => this.from(activity));
  }
}

export class ActivityListDto {
  @ApiProperty({
    description: '모임 목록',
    type: [ActivityDto],
  })
  activities!: ActivityDto[];

  static from(activities: ActivityData[]): ActivityListDto {
    return {
      activities: ActivityDto.fromArray(activities),
    };
  }
}
