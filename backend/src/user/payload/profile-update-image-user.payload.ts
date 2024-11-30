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

export class ProfileImageUpdatePayload {
  @ApiProperty({
    description: '이미지 파일 url',
    type: 'string',
  })
  image!: string;
}
