import {
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PatchUpdateUserPayload {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '유저 이름',
    type: String,
  })
  userName?: string | null;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    description: '유저 이메일',
    type: String,
  })
  email?: string | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    description: '유저 생일',
    type: Date,
    nullable: true,
  })
  birthday?: Date | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '프로필 이미지 파일',
    type: 'string',
    format: 'binary',
    nullable: true,
  })
  profileImage?: string | null;
}
