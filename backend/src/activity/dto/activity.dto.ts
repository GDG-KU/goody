import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActivityData } from '../type/activity-data.type';
import { IsOptional } from 'class-validator';

export class ActivityDto {
  @ApiProperty({
    description: '모임 ID',
    type: Number,
  })
  activityId!: number;

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
    description: '장소 이름',
    type: String,
  })
  locationName!: string;

  @ApiProperty({
    description: '이미지 주소',
    type: Number,
  })
  imageUrl!: string | null;

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

  static from(activity: ActivityData): ActivityDto {
    return {
      activityId: activity.id,
      userId: activity.userId,
      title: activity.title,
      description: activity.description,
      locationName: activity.locationName,
      imageUrl: activity.imageUrl,
      keywords: activity.activityKeywords.map((keyword) => keyword.keywordId),
    };
  }

  static fromArray(activitys: ActivityData[]): ActivityDto[] {
    return activitys.map((activity) => this.from(activity));
  }
}

export class ActivityListDto {
  @ApiProperty({
    description: '모임 목록',
    type: [ActivityDto],
  })
  activitys!: ActivityDto[];

  static from(activitys: ActivityData[]): ActivityListDto {
    return {
      activitys: ActivityDto.fromArray(activitys),
    };
  }
}
