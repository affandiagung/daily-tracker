// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/guard/roles.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'), RoleGuard('admin', 'user'))
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    const user = await this.userService.create(body);
    return {
      statusCode: 201,
      message: 'User created successfully',
      data: user,
    };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<User> {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
