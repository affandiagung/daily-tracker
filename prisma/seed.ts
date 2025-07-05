import { PrismaClient, Role, ProgressStatus, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';


const prisma = new PrismaClient();
async function main() {
  // Buat Admin
  const password = await bcrypt.hash('adminadmin', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      name: 'admin',
      password,
      role: Role.ADMIN,
    },
  });

  // Buat User biasa
  const user = await prisma.user.upsert({
    where: { email: 'user@user.com' },
    update: {},
    create: {
      email: 'user@user.com',
      name: 'user',
      password,
      role: Role.USER,
      members: {
        create: [
          { name: 'UserA' },
          { name: 'UserB' },
        ],
      },
    },
    include: {
      members: true,
    },
  });

  // Buat User biasa
  const quest = await prisma.user.upsert({
    where: { email: 'quest@quest.com' },
    update: {},
    create: {
      email: 'quest@quest.com',
      name: 'quest',
      password,
      role: Role.USER,
      members: {
        create: [
          { name: 'questA' },
          { name: 'questB' },
        ],
      },
    },
    include: {
      members: true,
    },
  });

  // Buat Target & Assign ke Member
  const target = await prisma.target.create({
    data: {
      name: 'Target Mudah Rejeki',
      description: 'Pantau sholat 5 waktu selama 30 hari',
      duration: 30,
      startDate: new Date(),
      userId: user.id,
      members: {
        connect: user.members.map((member) => ({ id: member.id })),
      }
    },
  });

  const taskNames = ['Membaca Yasin', 'Membaca Waqiah'];
  const tasks = await Promise.all(
    taskNames.map((name) =>
      prisma.task.create({
        data: {
          name,
          targetId: target.id,
        },
      }),
    ),
  );

  console.log('Seeder selesai ✅');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
