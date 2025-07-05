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
  Header,
  Req,
  ForbiddenException,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/guard/roles.guard';
import { Request } from 'express';
import { throwForbidden } from 'src/custom/helper/http.response';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(RoleGuard('ADMIN'))
  async findAll(@Req() request: Request) {
    const ip = request.ip || request.headers['x-forwarded-for'];
    console.log('IP Address:', ip);
    const data = await this.userService.findAll();
    return {
      statusCode: 200,
      message: 'success',
      data,
    };
  }

  @Get(':id')
  @UseGuards(RoleGuard('ADMIN'))
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.userService.findOne(id);
    return {
      statusCode: 200,
      message: 'success',
      data,
    };
  }

  @Post()
  @UseGuards(RoleGuard('ADMIN'))
  async create(@Body() body: CreateUserDto) {
    const data = await this.userService.create(body);
    return {
      statusCode: 201,
      message: 'User created successfully',
      data,
    };
  }

  @Put(':id')
  @UseGuards(RoleGuard('ADMIN', 'USER'))
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDto,
    @Req() req: any,
  ) {
    const isAdmin = req.user?.role === 'ADMIN';
    const isSelf = req.user?.id === id;

    if (!isAdmin) {
      if (!isSelf) {
        throwForbidden('You can only update your own account');
      }
      delete body.role;
    }

    const data = await this.userService.update(id, body);
    return {
      statusCode: 201,
      message: 'updated',
      data,
    };
  }

  @Delete(':id')
  @UseGuards(RoleGuard('admin'))
  remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
