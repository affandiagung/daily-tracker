import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsOptional, IsIn, IsEnum, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role must be ADMIN or USER' })
  role?: Role;
}