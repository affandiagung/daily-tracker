// member.controller.ts
import { Controller, Post, Get, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/guard/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('members')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'),RoleGuard('USER'))
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateMemberDto) {
    return this.memberService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.memberService.findAll(req.user.id);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.memberService.remove(req.user.id, id);
  }
}
