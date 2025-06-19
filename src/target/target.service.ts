import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';

@Injectable()
export class TargetService {
  constructor(private prisma: PrismaService) {}

  async createTarget(userId: string, dto: CreateTargetDto) {
    const { name, description, duration, startDate } = dto;


    return this.prisma.target.create({
      data: {
        name,
        description,
        duration,
        startDate: new Date(startDate),
        userId,
      },
    });
  }

  async findAllTargets(userId: string) {
    return this.prisma.target.findMany({
      where: { userId, isDeleted: false },
      include: {
        members: true,
        progress: true,
      },
    });
  }

  async deleteTarget(userId: string, targetId: string) {
    const target = await this.prisma.target.findUnique({
      where: { id: targetId },
    });

    if (!target) throw new NotFoundException('Target tidak ditemukan');
    if (target.userId !== userId) throw new ForbiddenException('Akses ditolak');

    return this.prisma.target.update({
      where: { id: targetId },
      data: { isDeleted: true },
    });
  }

  async updateTarget(userId: string, targetId: string, dto: UpdateTargetDto) {
    const target = await this.prisma.target.findUnique({
      where: { id: targetId },
    });

    if (!target) throw new NotFoundException('Target tidak ditemukan');
    if (target.userId !== userId) throw new ForbiddenException('Akses ditolak');
    if (target.isDeleted) throw new BadRequestException('Target sudah dihapus');

    const updateData: any = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.duration !== undefined) updateData.duration = dto.duration;
    if (dto.startDate !== undefined)
      updateData.startDate = new Date(dto.startDate);

    return this.prisma.target.update({
      where: { id: targetId },
      data: updateData,
    });
  }
}
