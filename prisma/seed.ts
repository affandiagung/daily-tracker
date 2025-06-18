import { PrismaClient, Role, ProgressStatus } from '@prisma/client';
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
          { name: 'Anak A' },
          { name: 'Anak B' },
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
      name: 'Sholat 5 Waktu',
      description: 'Pantau sholat 5 waktu selama 30 hari',
      duration: 30,
      startDate: new Date(),
      userId: user.id,
      members: {
        connect: user.members.map(m => ({ id: m.id })),
      },
    },
  });

  // Isi progress awal (PENDING)
  for (const member of user.members) {
    await prisma.progress.create({
      data: {
        date: new Date(), // hari ini
        status: ProgressStatus.PENDING,
        memberId: member.id,
        targetId: target.id,
      },
    });
  }

  console.log('Seeder selesai ✅');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
