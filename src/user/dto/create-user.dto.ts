import {
  IsEmail,
  isIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { userRoles } from '../constant/user.constant';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'Role of user',
    enum: userRoles,
    default: 'user',
  })
  @IsOptional()
  @IsString()
  role?: string;
}
