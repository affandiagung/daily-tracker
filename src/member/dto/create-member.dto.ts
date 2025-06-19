// dto/create-member.dto.ts
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @ApiProperty({ example: 'Anak Pertama' })
  @IsString()
  name: string;
}
