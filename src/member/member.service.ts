// member.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import {
  throwConflict,
  throwForbidden,
  throwNotFound,
} from 'src/custom/helper/http.response';
import { memberSelect } from 'src/prisma/select/member';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateMemberDto) {
    const existing = await this.prisma.member.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throwConflict('Member dengan nama tersebut sudah ada');
    }
    return this.prisma.member.create({
      data: {
        name: dto.name,
        userId,
      },
      select: memberSelect,
    });
  }

  async findAll(userId: string) {
    return this.prisma.member.findMany({
      where: { userId },
      select: memberSelect,
    });
  }

  async remove(userId: string, id: string) {
    const member = await this.prisma.member.findUnique({
      where: { id, isDeleted: false },
    });

    if (!member) {
      throwNotFound('Member tidak ditemukan');
    }
    if (member.userId !== userId) {
      throwForbidden('Akses ditolak');
    }

    const usedInProgress = await this.prisma.progress.findFirst({
      where: { memberId: id },
    });

    if (usedInProgress) {
      throw new ForbiddenException(
        'Member sudah memiliki progress, tidak bisa dihapus',
      );
    }

    return this.prisma.member.update({
      where: { id },
      data: { isDeleted: true },
      select: { name: true },
    });
  }
}
