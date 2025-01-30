import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ActivityLocationQuery {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: '위도',
    type: Number,
  })
  latitude!: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: '경도',
    type: Number,
  })
  longitude!: number;
}
