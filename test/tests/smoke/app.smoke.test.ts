import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import app from '../../src/server/app';
import { createUser, resetDatabase } from '../testUtils';

describe.sequential('Smoke tests', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('1) register -> 201', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'smoke-register@example.com',
      password: 'secret123',
    });

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({
      email: 'smoke-register@example.com',
      role: 'user',
    });
    expect(response.body.user.id).toBeTypeOf('number');
  });

  it('2) login -> 200 and session cookie exists', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'smoke-login@example.com',
      password: 'secret123',
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'smoke-login@example.com',
      password: 'secret123',
    });

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({
      email: 'smoke-login@example.com',
      role: 'user',
    });
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('3) auth required endpoint without login -> 401', async () => {
    const response = await request(app).get('/api/items');

    expect(response.status).toBe(401);
    expect(response.body.message).toContain('Giriş yapmanız gerekiyor');
  });

  it('4-8) create/list/read/update/delete item flow works end-to-end', async () => {
    const agent = request.agent(app);

    await agent.post('/api/auth/register').send({
      email: 'flow@example.com',
      password: 'secret123',
    });

    await agent.post('/api/auth/login').send({
      email: 'flow@example.com',
      password: 'secret123',
    });

    const createResponse = await agent.post('/api/items').send({
      name: 'Laptop',
      description: 'Test cihazı',
      quantity: 5,
      price: 45000,
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.id).toBeTypeOf('number');
    expect(createResponse.body.name).toBe('Laptop');

    const itemId = createResponse.body.id;

    const listResponse = await agent.get('/api/items');
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);
    expect(listResponse.body.some((item: any) => item.id === itemId && item.name === 'Laptop')).toBe(true);

    const getResponse = await agent.get(`/api/items/${itemId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toMatchObject({
      id: itemId,
      name: 'Laptop',
      quantity: 5,
      price: 45000,
    });

    const updateResponse = await agent.patch(`/api/items/${itemId}`).send({
      name: 'Laptop Pro',
      quantity: 7,
      price: 47000,
    });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe('Laptop Pro');
    expect(updateResponse.body.quantity).toBe(7);
    expect(updateResponse.body.price).toBe(47000);

    const deleteResponse = await agent.delete(`/api/items/${itemId}`);
    expect(deleteResponse.status).toBe(204);

    const afterDeleteResponse = await agent.get(`/api/items/${itemId}`);
    expect(afterDeleteResponse.status).toBe(404);
  });

  it('9) invalid create/update requests -> 400', async () => {
    const agent = request.agent(app);

    await agent.post('/api/auth/register').send({
      email: 'validation@example.com',
      password: 'secret123',
    });

    await agent.post('/api/auth/login').send({
      email: 'validation@example.com',
      password: 'secret123',
    });

    const invalidCreate = await agent.post('/api/items').send({
      name: '   ',
      quantity: -1,
      price: -10,
    });

    expect(invalidCreate.status).toBe(400);
    expect(invalidCreate.body.errors.length).toBeGreaterThan(0);

    const validCreate = await agent.post('/api/items').send({
      name: 'Mouse',
      quantity: 2,
      price: 500,
    });

    const invalidUpdate = await agent.patch(`/api/items/${validCreate.body.id}`).send({
      name: '',
      quantity: -5,
      price: -1,
    });

    expect(invalidUpdate.status).toBe(400);
    expect(invalidUpdate.body.errors.length).toBeGreaterThan(0);
  });

  it('10) admin-only endpoint -> user 403, admin 200', async () => {
    const normalUser = request.agent(app);
    await normalUser.post('/api/auth/register').send({
      email: 'normal@example.com',
      password: 'secret123',
    });
    await normalUser.post('/api/auth/login').send({
      email: 'normal@example.com',
      password: 'secret123',
    });

    const forbiddenResponse = await normalUser.get('/api/admin/report');
    expect(forbiddenResponse.status).toBe(403);

    const admin = await createUser({
      email: 'admin@example.com',
      password: 'secret123',
      role: 'admin',
    });

    const adminAgent = request.agent(app);
    await adminAgent.post('/api/auth/login').send({
      email: admin.email,
      password: admin.password,
    });

    const successResponse = await adminAgent.get('/api/admin/report');
    expect(successResponse.status).toBe(200);
    expect(successResponse.body).toHaveProperty('totalItems');
    expect(successResponse.body).toHaveProperty('totalUsers');
    expect(successResponse.body).toHaveProperty('totalValue');
  });
});
