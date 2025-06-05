// src/user/user.service.ts
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Partial<User>[]> {
  return this.prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt : true
    },
  });
}

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findWhere(where: Partial<User>): Promise<User | null> {
  return this.prisma.user.findFirst({ where });
}

  async create(data: CreateUserDto){
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
          role: data.role ?? 'user',
        },
        select: {
          name: true,
          email:true
        },
      });
      return user
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('User already exist');
      }

      throw new InternalServerErrorException(
        'Terjadi Kesalahan, silahkan coba lagi',
      );
    }
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      password: string;
      role: string;
    }>,
  ): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
