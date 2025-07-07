import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';
import { Prisma } from '@prisma/client';
import {
  throwBadRequest,
  throwConflict,
  throwForbidden,
  throwNotFound,
} from 'src/custom/helper/http.response';

@Injectable()
export class TargetService {
  constructor(private prisma: PrismaService) {}

  async findAllTargets(userId: string) {
    const targets = await this.prisma.target.findMany({
      where: { userId, isDeleted: false },
      include: {
        // members: true,
        tasks: true,
      },
    });

    return targets.map((target) => ({
      id: target.id,
      name: target.name,
      description: target.description,
      duration: target.duration,
      startDate: target.startDate,
      // members: target.members.map((m) => ({
      //   id: m.id,
      //   name: m.name,
      // })),
      tasks: target.tasks.map((t) => ({ id: t.id, name: t.name })),
    }));
  }

  async findOneTarget(id: string) {
    const target = await this.prisma.target.findUnique({
      where: { id },
      include: {
        tasks: {
          where: { isDeleted: false },
          select: { id: true, name: true },
        },
        members: {
          where: { isDeleted: false },
          include: {
            progress: {
              where: {
                isDeleted: false,
                status: 'DONE',
              },
              select: {
                date: true,
                taskId: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!target) {
      throwNotFound('Target not found');
    }

    const totalTask = target.tasks.length;
    const totalUnit = totalTask * target.duration;

    // count member progress
    const members = target.members.map((member) => {
      const progressByTask = target.tasks.map((task) => {
        const doneLogs = member.progress.filter((p) => p.taskId === task.id);
        const datesDone = doneLogs.map(
          (p) => p.date.toISOString().split('T')[0],
        );

        const today = new Date().toISOString().split('T')[0];
        return {
          taskId: task.id,
          taskName: task.name,
          today: datesDone.includes(today),
          doneDates: [...new Set(datesDone)],
        };
      });

      const totalDoneCount = progressByTask.reduce(
        (sum, task) => sum + task.doneDates.length,
        0,
      );

      const progressPercentage =
        totalUnit > 0
          ? parseFloat(((totalDoneCount / totalUnit) * 100).toFixed(2))
          : 0;

      return {
        memberId: member.id,
        memberName: member.name,
        progressPercentage,
        progressByTask,
      };
    });

    return {
      id: target.id,
      name: target.name,
      description: target.description,
      duration: target.duration,
      startDate: target.startDate,
      createdAt: target.createdAt,
      tasks: target.tasks,
      members,
    };
  }

  async createTarget(userId: string, dto: CreateTargetDto) {
    const { name, description, duration, startDate, tasks } = dto;
    const existing = await this.prisma.target.findFirst({
      where: {
        userId,
        name,
        startDate: new Date(startDate),
      },
    });

    if (existing) {
      throwConflict('Target dengan nama dan tanggal mulai tersebut sudah ada');
    }

    const members = await this.prisma.member.findMany({ where: { userId } });
    if (!members.length) {
      throwBadRequest('Silakan tambahkan minimal 1 member terlebih dahulu');
    }

    const start = new Date(startDate);

    // using transaction prisma
    return await this.prisma.$transaction(async (tx) => {
      // Create the target
      const target = await tx.target.create({
        data: {
          name,
          description,
          duration,
          startDate: new Date(startDate),
          userId,
          members: {
            connect: members.map((m) => ({ id: m.id })),
          },
        },
      });

      // Create tasks
      const createdTasks = await Promise.all(
        tasks.map((taskName) =>
          tx.task.create({
            data: {
              name: taskName,
              targetId: target.id,
            },
          }),
        ),
      );

      // // TODO: Apakah perlu dibuatkan progress base on tasks?
      // // Default generate progress base on tasks
      // const progressData: Prisma.ProgressCreateManyInput[] = [];

      // for (const task of createdTasks) {
      //   for (const member of members) {
      //     for (let i = 0; i < duration; i++) {
      //       const progressDate = new Date(start);
      //       progressDate.setDate(progressDate.getDate() + i);
      //       progressDate.setHours(0, 0, 0, 0);

      //       progressData.push({
      //         date: progressDate,
      //         status: 'PENDING',
      //         memberId: member.id,
      //         taskId: task.id,
      //         createdAt: new Date(),
      //       });
      //     }
      //   }
      // }

      // // 4. Simpan progress dengan batching
      // const batchSize = 100;
      // const chunks = Array.from(
      //   { length: Math.ceil(progressData.length / batchSize) },
      //   (_, i) => progressData.slice(i * batchSize, (i + 1) * batchSize),
      // );

      // for (const chunk of chunks) {
      //   await Promise.all(chunk.map((data) => tx.progress.create({ data })));
      // }

      return {
        ...target,
        tasks: createdTasks.map((e) => ({ id: e.id, name: e.name })),
      };
    });
  }

  async updateTarget(userId: string, targetId: string, dto: UpdateTargetDto) {
    const target = await this.prisma.target.findUnique({
      where: { id: targetId },
    });

    if (!target) throwNotFound('Target tidak ditemukan');
    if (target.userId !== userId) throwForbidden('Akses ditolak');
    if (target.isDeleted) throwBadRequest('Target sudah dihapus');

    const updateData: any = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.duration) updateData.duration = dto.duration;

    return this.prisma.target.update({
      where: { id: targetId },
      data: updateData,
    });
  }

  async deleteTarget(userId: string, targetId: string) {
    const target = await this.prisma.target.findUnique({
      where: { id: targetId, isDeleted: false },
    });

    if (!target) throwNotFound('Target tidak ditemukan');
    if (target.userId !== userId) throwForbidden('Akses ditolak');

    return this.prisma.target.update({
      where: { id: targetId },
      data: { isDeleted: true },
    });
  }

  async submitProgressToday(memberId: string, taskId: string, userId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      throwNotFound('Member tidak ditemukan');
    }

    if (member.userId !== userId) {
      throwForbidden('Akses ditolak: member bukan milik anda');
    }

    // Ambil task dan targetnya
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        isDeleted: false,
        target: {
          isDeleted: false,
          userId: userId, // validasi kepemilikan
        },
      },
      include: {
        target: true,
      },
    });

    if (!task) {
      throwForbidden('Task tidak valid atau tidak dimiliki oleh user');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const progress = await this.prisma.progress.upsert({
      where: {
        date_memberId_taskId: {
          date: today,
          memberId,
          taskId,
        },
      },
      update: {
        status: 'DONE',
      },
      create: {
        date: today,
        memberId,
        taskId,
        status: 'DONE',
      },
    });

    return progress
  }
}
