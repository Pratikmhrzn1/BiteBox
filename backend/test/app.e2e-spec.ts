import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

type AuthResponse = {
  user: { id: string; email: string; role: string };
  accessToken: string;
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@bitebox.com.np';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123';

describe('BiteBox API (e2e)', () => {
  let app: INestApplication<App>;
  let adminToken = '';
  let customerToken = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('auth', () => {
    it('POST /api/auth/register creates a customer account', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          name: 'E2E Customer',
          email: `e2e-${Date.now()}@bitebox.com.np`,
          phone: '9800000000',
          password: 'secret123',
        })
        .expect(201);

      const body = res.body as AuthResponse;
      expect(body.user.email).toContain('@bitebox.com.np');
      expect(body.user.role).toBe('CUSTOMER');
      expect(body.accessToken).toBeDefined();
      customerToken = body.accessToken;
    });

    it('POST /api/auth/register rejects a duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          name: 'Duplicate',
          email: ADMIN_EMAIL,
          password: 'secret123',
        })
        .expect(409);
    });

    it('POST /api/auth/login returns a token for the admin', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        .expect(200);

      const body = res.body as AuthResponse;
      expect(body.user.role).toBe('ADMIN');
      expect(body.accessToken).toBeDefined();
      adminToken = body.accessToken;
    });

    it('POST /api/auth/login rejects a bad password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: ADMIN_EMAIL, password: 'wrong-password' })
        .expect(401);
    });

    it('GET /api/auth/me returns the current user', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const body = res.body as { email: string; role: string };
      expect(body.email).toBe(ADMIN_EMAIL);
      expect(body.role).toBe('ADMIN');
    });

    it('GET /api/auth/me rejects a missing token', async () => {
      await request(app.getHttpServer()).get('/api/auth/me').expect(401);
    });
  });

  describe('orders', () => {
    it('POST /api/orders stores an order with payment info', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/orders')
        .send({
          customerName: 'E2E Customer',
          customerPhone: '9800000000',
          items: [
            {
              itemId: 'smashed-chicken-burger',
              name: 'Smashed Chicken Burger',
              price: 290,
              quantity: 2,
              extras: [
                { id: 'extra-cheese', label: 'Extra Cheese', price: 40 },
              ],
            },
          ],
          subtotal: 660,
          deliveryFee: 50,
          total: 710,
          paymentMethod: 'CARD',
        })
        .expect(201);

      const body = res.body as {
        id: string;
        total: number;
        paymentMethod: string;
        paymentStatus: string;
      };
      expect(body.id).toBeDefined();
      expect(body.total).toBe(710);
      expect(body.paymentMethod).toBe('CARD');
      expect(body.paymentStatus).toBe('PENDING');
    });

    it('POST /api/orders links an authenticated customer', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          customerName: 'E2E Customer',
          customerPhone: '9800000000',
          items: [
            {
              itemId: 'smash-burger',
              name: 'Smash Burger',
              price: 250,
              quantity: 1,
              extras: [],
            },
          ],
          subtotal: 250,
          deliveryFee: 50,
          total: 300,
          paymentMethod: 'ONLINE',
        })
        .expect(201);

      const body = res.body as { id: string };
      expect(body.id).toBeDefined();

      const orders = (
        await request(app.getHttpServer())
          .get('/api/admin/orders')
          .set('Authorization', `Bearer ${adminToken}`)
      ).body as unknown[];
      expect(orders.length).toBeGreaterThan(0);
    });

    it('POST /api/orders rejects an invalid paymentMethod', async () => {
      await request(app.getHttpServer())
        .post('/api/orders')
        .send({
          customerName: 'E2E Customer',
          customerPhone: '9800000000',
          items: [],
          subtotal: 0,
          deliveryFee: 50,
          total: 50,
          paymentMethod: 'BITCOIN',
        })
        .expect(400);
    });
  });

  describe('admin', () => {
    it('GET /api/admin/orders requires a token', async () => {
      await request(app.getHttpServer()).get('/api/admin/orders').expect(401);
    });

    it('GET /api/admin/orders denies a customer', async () => {
      await request(app.getHttpServer())
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);
    });

    it('GET /api/admin/users returns seeded users', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const body = res.body as { email: string; role: string }[];
      expect(body.some((u) => u.email === ADMIN_EMAIL)).toBe(true);
      expect(body.some((u) => u.role === 'ADMIN')).toBe(true);
    });

    it('GET /api/admin/payments returns payment records', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admin/payments')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const body = res.body as {
        id: string;
        paymentMethod: string;
        paymentStatus: string;
        total: number;
      }[];
      expect(body.length).toBeGreaterThan(0);
      expect(body[0].paymentMethod).toBeDefined();
      expect(body[0].paymentStatus).toBeDefined();
    });

    it('GET /api/admin/summary returns counts and revenue', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admin/summary')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const body = res.body as {
        userCount: number;
        orderCount: number;
        pendingPayments: number;
        paidAmount: number;
      };
      expect(body.userCount).toBeGreaterThan(0);
      expect(body.orderCount).toBeGreaterThan(0);
      expect(body.paidAmount).toBeGreaterThanOrEqual(0);
    });

    it('updates an order status as admin', async () => {
      const orders = (
        await request(app.getHttpServer())
          .get('/api/admin/orders')
          .set('Authorization', `Bearer ${adminToken}`)
      ).body as { id: string; status: string }[];

      const target = orders[0];
      const res = await request(app.getHttpServer())
        .patch(`/api/admin/orders/${target.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'DELIVERED' })
        .expect(200);

      const body = res.body as { status: string };
      expect(body.status).toBe('DELIVERED');
    });

    it('rejects updating a non-existent order', async () => {
      await request(app.getHttpServer())
        .patch('/api/admin/orders/does-not-exist/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'DELIVERED' })
        .expect(404);
    });
  });
});
