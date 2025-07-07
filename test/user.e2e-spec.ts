import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let createdUserId: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Seed admin
    const admin = await prisma.user.upsert({
      where: { email: 'admin@admin.com' },
      update: {},
      create: {
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'adminadmin',
        role: 'ADMIN',
      },
    });

    // Login untuk dapatkan token
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@admin.com', password: 'adminadmin' });

    adminToken = loginRes.body.access_token;
  });

  it('POST /users → should create a new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test User',
        email: 'testuser@test.com',
        password: 'password123',
        role: 'USER',
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    createdUserId = res.body.data.id;
  });

  it('GET /users → should return all users', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /users/:id → should return specific user', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('id', createdUserId);
  });

  it('PUT /users/:id → should update user name', async () => {
    const res = await request(app.getHttpServer())
      .put(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Name' });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Updated Name');
  });

  it('DELETE /users/:id → should soft-delete user', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', createdUserId);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: ['testuser@test.com'] } },
    });
    await app.close();
  });
});
