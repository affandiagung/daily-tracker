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
  Req,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/guard/roles.guard';
import {
  successResponse,
  throwForbidden,
} from 'src/custom/helper/http.response';
import { Response } from 'express';
import { RequestWithUser } from 'src/custom/interfaces/requestWithUser.interface';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(RoleGuard('ADMIN'))
  async findAll(@Req() request: RequestWithUser, @Res() res: Response) {
    const data = await this.userService.findAll();
    return res.status(200).json(successResponse(data, 'Success', 200));
  }

  @Get(':id')
  @UseGuards(RoleGuard('ADMIN'))
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: Response,
  ) {
    const data = await this.userService.findOne(id);
    return res.status(200).json(successResponse(data, 'Success', 200));
  }

  @Post()
  @UseGuards(RoleGuard('ADMIN'))
  async create(@Body() body: CreateUserDto, @Res() res: Response) {
    const data = await this.userService.create(body);
    return res.status(201).json(successResponse(data, 'Success', 201));
  }

  @Put(':id')
  @UseGuards(RoleGuard('ADMIN', 'USER'))
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDto,
    @Req() req: RequestWithUser,
    @Res() res: Response,
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
    return res.status(201).json(successResponse(data, 'Member Updated', 201));
  }

  @Delete(':id')
  @UseGuards(RoleGuard('admin'))
  remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
