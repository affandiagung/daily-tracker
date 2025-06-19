// dto/create-target.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsArray,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateTargetDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsInt()
  @Min(1, { message: 'Duration harus lebih dari 0' })
  duration: number;

  @ApiProperty()
  @IsDateString()
  startDate: string;

}
