import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDecimal, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ActivityLocationQuery {
  @IsDecimal()
  @Type(() => Number)
  @ApiProperty({
    description: '위도',
    type: Number,
  })
  latitude!: number;

  @IsDecimal()
  @Type(() => Number)
  @ApiProperty({
    description: '경도',
    type: Number,
  })
  longitude!: number;
}
