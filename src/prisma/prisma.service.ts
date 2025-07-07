// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url:
            process.env.NODE_ENV === 'test'
              ? process.env.DATABASE_URL_TESTING
              : process.env.DATABASE_URL,
        },
      },
    });
  }
  async onModuleInit() {
    await this.$connect();

    // Middleware: inject `isDeleted: false` to specific queries
    this.$use(async (params, next) => {
      const modelsWithIsDeleted = [
        'User',
        'Member',
        'Target',
        'Task',
        'Progress',
      ];

      if (
        params.model &&
        modelsWithIsDeleted.includes(params.model) &&
        ['findMany', 'findFirst'].includes(params.action)
      ) {
        if (!params.args) params.args = {};

        params.args.where = {
          ...params.args.where,
          isDeleted: false,
        };
      }

      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
