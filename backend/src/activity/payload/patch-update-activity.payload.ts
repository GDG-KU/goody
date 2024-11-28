import { IsDate,
  IsInt, 
  IsOptional, 
  IsString, 
  Max, 
  Min, 
  IsArray, 
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PatchUpdateActivityPayload {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '활동 이름',
    type: String,
  })
  title?: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '활동 설명',
    type: String,
  })
  description?: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '활동 장소 이름',
    type: String,
  })
  locationName?: string | null;

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsArray()
  @ApiPropertyOptional({
    description: 'keyword IDs',
    type: [Number],
  })
  keywords?: number[] | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '이미지 URL',
    type: String,
  })
  imageUrl?: string | null;
}
