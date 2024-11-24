import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Type } from 'class-transformer';

export class CreateActivityPayload {
  @IsString()
  @ApiProperty({
    description: '활동 이름',
    type: String,
  })
  title!: string;

  @IsArray()
  @IsInt({ each: true })
  @ApiProperty({
    description: '키워드 ID들',
    type: [Number],
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => parseInt(item.trim(), 10));
    }
    if (Array.isArray(value)) {
      return value.map((item) => parseInt(item, 10));
    }
    return [];
  })
  keywords!: number[];

  @IsString()
  @ApiProperty({
    description: '모임 설명',
    type: String,
  })
  description!: string;

  @IsString()
  @ApiProperty({
    description: '장소 이름',
    type: String,
  })
  locationName!: string;

  @ApiProperty({
    description: '이미지 파일',
    type: 'string',
    format: 'binary',
  })
  image!: any;
}
