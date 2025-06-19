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
} from '@nestjs/common';
import { TargetService } from './target.service';

import { CreateTargetDto } from './dto/create-target.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/guard/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateTargetDto } from './dto/update-target.dto';

@Controller('targets')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RoleGuard('USER'))
export class TargetController {
  constructor(private readonly targetService: TargetService) {}

  @Get()
  findAll(@Req() req) {
    return this.targetService.findAllTargets(req.user.id);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateTargetDto) {
    return this.targetService.createTarget(req.user.id, dto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return this.targetService.deleteTarget(req.user.id, id);
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateTargetDto,
  ) {
    return this.targetService.updateTarget(req.user.id, id, dto);
  }
}
