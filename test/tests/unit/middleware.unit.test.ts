import { describe, expect, it, vi } from 'vitest';
import { isAdmin, isAuthenticated } from '../../src/server/middleware/auth';
import { validateCreateItem, validateUpdateItem } from '../../src/server/middleware/validate';
import type { Request, Response, NextFunction } from 'express';

function createRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
}

function makeReq(partial: Record<string, unknown>): Request {
  return partial as unknown as Request;
}

describe('Middleware unit tests', () => {
  it('isAuthenticated blocks requests without session', () => {
    const req = makeReq({ session: {} });
    const res = createRes();
    const next = vi.fn() as NextFunction;

    isAuthenticated(req, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('isAuthenticated allows requests with userId', () => {
    const req = makeReq({ session: { userId: 1 } });
    const res = createRes();
    const next = vi.fn() as NextFunction;

    isAuthenticated(req, res as unknown as Response, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('isAdmin blocks regular users with 403', () => {
    const req = makeReq({ session: { userId: 1, role: 'user' } });
    const res = createRes();
    const next = vi.fn() as NextFunction;

    isAdmin(req, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('isAdmin allows admin users', () => {
    const req = makeReq({ session: { userId: 1, role: 'admin' } });
    const res = createRes();
    const next = vi.fn() as NextFunction;

    isAdmin(req, res as unknown as Response, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('validateCreateItem rejects invalid payload', () => {
    const req = makeReq({ body: { name: ' ', quantity: -1, price: -5 } });
    const res = createRes();
    const next = vi.fn() as NextFunction;

    validateCreateItem(req, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('validateUpdateItem accepts valid partial payload', () => {
    const req = makeReq({ body: { price: 99.9 } });
    const res = createRes();
    const next = vi.fn() as NextFunction;

    validateUpdateItem(req, res as unknown as Response, next);

    expect(next).toHaveBeenCalledOnce();
  });
});