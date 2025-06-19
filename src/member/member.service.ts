// member.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateMemberDto) {
    return this.prisma.member.create({
      data: {
        name: dto.name,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.member.findMany({
      where: { userId },
    });
  }

  async remove(userId: string, id: string) {
    const member = await this.prisma.member.findUnique({ where: { id } });
    if (!member || member.userId !== userId) {
      throw new ForbiddenException('Akses ditolak');
    }

    // Optional: Cek apakah ada relasi progress/target
    const usedInProgress = await this.prisma.progress.findFirst({
      where: { memberId: id },
    });

    if (usedInProgress) {
      throw new ForbiddenException('Member sudah memiliki progress, tidak bisa dihapus');
    }

    return this.prisma.member.delete({ where: { id } });
  }
}
