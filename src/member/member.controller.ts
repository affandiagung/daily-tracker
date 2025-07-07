// member.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/guard/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { RequestWithUser } from 'src/custom/interfaces/requestWithUser.interface';
import { successResponse } from 'src/custom/helper/http.response';

@Controller('members')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RoleGuard('USER'))
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() dto: CreateMemberDto,
    @Res() res: Response,
  ) {
    const data = await this.memberService.create(req.user.id, dto);
    return res.status(201).json(successResponse(data, 'Data disimpan', 201));
  }

  @Get()
  async findAll(@Req() req: RequestWithUser, @Res() res: Response) {
    const data = await this.memberService.findAll(req.user.id);
    return res
      .status(200)
      .json(
        successResponse(
          data,
          data.length > 0 ? 'Data ditemukan' : 'Data kosong',
          200,
        ),
      );
  }

  @Delete(':id')
  async remove(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const data = await this.memberService.remove(req.user.id, id);
    return res.status(201).json(successResponse(data, 'Data dihapus', 201));
  }
}
