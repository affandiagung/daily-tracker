// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

 async create(data: { name: string; email: string; password: string; role?: string }): Promise<User> {
  return this.prisma.user.create({
    data: {
      ...data,
      role: data.role ?? 'USER', 
    },
  });
}


  async update(id: string, data: Partial<{ name: string; email: string; password: string; role: string }>): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
