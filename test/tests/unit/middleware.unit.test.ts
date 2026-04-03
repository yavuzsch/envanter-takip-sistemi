import { describe, expect, it, vi } from 'vitest';
import { isAdmin, isAuthenticated } from '../../src/server/middleware/auth';
import { validateCreateItem, validateUpdateItem } from '../../src/server/middleware/validate';

function createRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
}

describe('Middleware unit tests', () => {
  it('isAuthenticated blocks requests without session', () => {
    const req: any = { session: {} };
    const res = createRes();
    const next = vi.fn();

    isAuthenticated(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('isAuthenticated allows requests with userId', () => {
    const req: any = { session: { userId: 1 } };
    const res = createRes();
    const next = vi.fn();

    isAuthenticated(req, res as any, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('isAdmin blocks regular users with 403', () => {
    const req: any = { session: { userId: 1, role: 'user' } };
    const res = createRes();
    const next = vi.fn();

    isAdmin(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('isAdmin allows admin users', () => {
    const req: any = { session: { userId: 1, role: 'admin' } };
    const res = createRes();
    const next = vi.fn();

    isAdmin(req, res as any, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('validateCreateItem rejects invalid payload', () => {
    const req: any = { body: { name: ' ', quantity: -1, price: -5 } };
    const res = createRes();
    const next = vi.fn();

    validateCreateItem(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('validateUpdateItem accepts valid partial payload', () => {
    const req: any = { body: { price: 99.9 } };
    const res = createRes();
    const next = vi.fn();

    validateUpdateItem(req, res as any, next);

    expect(next).toHaveBeenCalledOnce();
  });
});
