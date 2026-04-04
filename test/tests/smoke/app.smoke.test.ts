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

  const getAuthAgent = async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/register').send({ email: 'smoke@example.com', password: 'password123' });
    await agent.post('/api/auth/login').send({ email: 'smoke@example.com', password: 'password123' });
    return agent;
  };

  it('4) create item -> 201', async () => {
    const agent = await getAuthAgent();
    const res = await agent.post('/api/items').send({
      name: 'Laptop', description: 'Test', quantity: 5, price: 45000 
    });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Laptop');
  });

  it('5) list items -> 200', async () => {
    const agent = await getAuthAgent();
    // Önce bir item oluşturmalıyız (çünkü database her it öncesi sıfırlanıyor)
    await agent.post('/api/items').send({ name: 'Item 1', quantity: 1, price: 100 });
    
    const res = await agent.get('/api/items');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('6) read item by id -> 200', async () => {
    const agent = await getAuthAgent();
    const createRes = await agent.post('/api/items').send({ name: 'FindMe', quantity: 1, price: 100 });
    const itemId = createRes.body.id;

    const res = await agent.get(`/api/items/${itemId}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('FindMe');
  });

  it('7) update item -> 200', async () => {
    const agent = await getAuthAgent();
    const createRes = await agent.post('/api/items').send({ name: 'Old Name', quantity: 1, price: 100 });
    const itemId = createRes.body.id;

    const res = await agent.patch(`/api/items/${itemId}`).send({ name: 'New Name' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('New Name');
  });

  it('8) delete item -> 204', async () => {
    const agent = await getAuthAgent();
    const createRes = await agent.post('/api/items').send({ name: 'To Be Deleted', quantity: 1, price: 100 });
    const itemId = createRes.body.id;

    const deleteRes = await agent.delete(`/api/items/${itemId}`);
    expect(deleteRes.status).toBe(204);

    const checkRes = await agent.get(`/api/items/${itemId}`);
    expect(checkRes.status).toBe(404);
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
