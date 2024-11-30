import { ApiProperty } from '@nestjs/swagger';
import { ActivityLocationData } from '../type/activity-location-data.type';

export class ActivityLocationDto {
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

  static from(location: ActivityLocationData): ActivityLocationDto {
    return {
      activityId: location.activityId,
      latitude: location.latitude,
      longitude: location.longitude,
    };
  }

  static fromArray(locations: ActivityLocationData[]): ActivityLocationDto[] {
    return locations.map((location) => ActivityLocationDto.from(location));
  }
}
