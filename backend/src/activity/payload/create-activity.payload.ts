import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateActivityPayload {
  @IsString()
  @ApiProperty({
    description: '활동 이름',
    type: String,
  })
  title!: string;

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
  @IsOptional()
  @ApiPropertyOptional({
    description: '이미지 주소',
    type: String,
    nullable: true,
  })
  imageUrl?: string | null;
}
