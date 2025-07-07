// dto/create-target.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';
import { IsNotPastDate } from 'src/custom/IsNotPastDate';

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

  @ApiProperty({
    type: String,
    description: 'Tanggal mulai target',
    example: '2023-01-01',
  })
  @IsDateString()
  @IsNotPastDate({ message: 'startDate tidak boleh lebih kecil dari hari ini' })
  startDate: string;

  @ApiProperty({
    type: [String],
    description: 'List task yang ingin dilakukan dalam target',
    example: ['Membaca Yasin', 'Membaca Waqiah'],
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'Tasks tidak boleh kosong' })
  @ArrayMinSize(1, { message: 'Minimal 1 task diperlukan' })
  @IsString({ each: true })
  tasks: string[];
}
