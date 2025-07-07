// target.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Delete,
  Put,
  Param,
  Res,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TargetService } from './target.service';
import { CreateTargetDto } from './dto/create-target.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/guard/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateTargetDto } from './dto/update-target.dto';
import { AuthRequest } from 'src/custom/interfaces/ auth-request.interface';
import { successResponse } from 'src/custom/helper/http.response';
import { Response } from 'express';

@Controller('targets')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RoleGuard('USER'))
export class TargetController {
  constructor(private readonly targetService: TargetService) {}

  @Get()
  async findAll(@Req() req: AuthRequest, @Res() res: Response) {
    console.log(req.user.id);
    const data = await this.targetService.findAllTargets(req.user.id);
    return res.status(200).json(successResponse(data, 'Success', 200));
  }

  @Get('/:id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: Response,
  ) {
    const data = await this.targetService.findOneTarget(id);
    return res.status(200).json(successResponse(data, 'Success', 200));
  }

  @Post()
  async create(
    @Req() req: AuthRequest,
    @Body() dto: CreateTargetDto,
    @Res() res: Response,
  ) {
    const data = await this.targetService.createTarget(req.user.id, dto);
    return res.status(201).json(successResponse(data, 'Success', 201));
  }

  @Put(':id')
  async update(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateTargetDto,
    @Res() res: Response,
  ) {
    return res
      .status(200)
      .json(await this.targetService.updateTarget(req.user.id, id, dto));
  }

  @Delete(':id')
  async remove(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const data = await this.targetService.deleteTarget(req.user.id, id);
    return res.status(200).json(successResponse(data, 'Success', 200));
  }
}
