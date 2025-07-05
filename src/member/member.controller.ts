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
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/guard/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('members')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RoleGuard('USER'))
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  async create(@Req() req, @Body() dto: CreateMemberDto) {
    const data = await this.memberService.create(req.user.id, dto);
    return {
      statusCode: 201,
      message: 'Data berhasil disimpan',
      data,
    };
  }

  @Get()
  async findAll(@Req() req) {
    const data = await this.memberService.findAll(req.user.id);
    return {
      statusCode: 200,
      message: data.length > 0 ? 'Data ditemukan' : 'Data kosong',
      data,
    };
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const data = await this.memberService.remove(req.user.id, id);
    return {
      statusCode: 201,
      message: 'Member berhasil dihapus',
      data,
    };
  }
}
