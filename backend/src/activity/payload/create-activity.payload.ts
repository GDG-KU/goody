import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsDecimal,
  IsIn,
  IsInt,
  IsNumber,
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

  @IsString()
  @ApiProperty({
    description: '이미지 파일',
    type: String,
  })
  imageUrl!: string;

  @IsDecimal()
  @ApiProperty({
    description: '위도',
    type: Number,
  })
  latitude!: number;

  @IsDecimal()
  @ApiProperty({
    description: '경도',
    type: Number,
  })
  longitude!: number;
}
