import { ApiProperty } from '@nestjs/swagger';
import { ActivityLocationData } from '../type/activity-location-data.type';

export class ActivityLocationDto {
  @ApiProperty({
    description: 'activity 장소 id',
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: 'activity의 id',
    type: Number,
  })
  activityId!: number;

  @ApiProperty({
    description: 'activity의 위도',
    type: Number,
  })
  latitude!: number;

  @ApiProperty({
    description: 'activity의 경도',
    type: Number,
  })
  longitude!: number;

  @ApiProperty({
    description: 'activity 장소 이름',
    type: String,
  })
  name!: string;

  static from(location: ActivityLocationData): ActivityLocationDto {
    return {
      id: location.id,
      activityId: location.activityId,
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name,
    };
  }

  static fromArray(locations: ActivityLocationData[]): ActivityLocationDto[] {
    return locations.map((location) => ActivityLocationDto.from(location));
  }
}
