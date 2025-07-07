import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignTaskDto {
  @ApiProperty()
  @IsUUID()
  memberId: string;

  @ApiProperty()
  @IsUUID()
  taskId: string;
}
