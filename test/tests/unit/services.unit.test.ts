import { beforeEach, describe, expect, it, vi } from 'vitest';
import bcrypt from 'bcrypt';

const mockPrepare = {
  get: vi.fn(),
  run: vi.fn(),
  all: vi.fn(),
};

const mockDb = {
  prepare: vi.fn(() => mockPrepare),
};

vi.mock('../../src/server/config/db', () => ({
  getDb: () => mockDb,
}));

vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn().mockResolvedValue(true),
    hash: vi.fn().mockResolvedValue('hashed_password'),
  },
  compare: vi.fn().mockResolvedValue(true),
  hash: vi.fn().mockResolvedValue('hashed_password'),
}));

import { registerUser, loginUser } from '../../src/server/modules/auth/auth.service';
import {
  createItem,
  deleteItem,
  getAllItems,
  getItemById,
  updateItem,
} from '../../src/server/modules/item/item.service';

describe.sequential('Service unit tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrepare.get.mockReset();
    mockPrepare.run.mockReset();
    mockPrepare.all.mockReset();
  });


  it('registerUser creates a new user', async () => {
    mockPrepare.get.mockReturnValue(undefined); 
    mockPrepare.run.mockReturnValue({ lastInsertRowid: 1 });

    const user = await registerUser('unit-register@example.com', 'secret123');

    expect(user).toMatchObject({
      email: 'unit-register@example.com',
      role: 'user',
    });
    expect(user.id).toBe(1);
    expect(mockPrepare.run).toHaveBeenCalled();
  });

  it('registerUser rejects duplicate email', async () => {
    mockPrepare.get.mockReturnValue({ id: 1 });

    await expect(registerUser('duplicate@example.com', 'secret123')).rejects.toMatchObject({
      status: 409,
      message: 'Bu e-posta zaten kayıtlı.',
    });
  });

  it('loginUser returns the user for correct credentials', async () => {
    mockPrepare.get.mockReturnValue({
      id: 1,
      email: 'login-success@example.com',
      password: 'hashed_password', 
    });

    const user = await loginUser('login-success@example.com', 'secret123');
    expect(user.email).toBe('login-success@example.com');
    expect(user.id).toBe(1);
  });

  it('loginUser rejects unknown email', async () => {
    mockPrepare.get.mockReturnValue(undefined);

    await expect(loginUser('unknown@example.com', 'secret123')).rejects.toMatchObject({
      status: 401,
      message: 'E-posta veya parola hatalı.',
    });
  });

  it('loginUser rejects wrong password with 401', async () => {
   mockPrepare.get.mockReturnValue({
     id: 1,
     email: 'test@example.com',
     password: 'hashed_password_in_db',
     role: 'user',
   });

   vi.mocked(bcrypt.compare).mockImplementationOnce(async () => false);

   await expect(loginUser('test@example.com', 'wrong-password')).rejects.toMatchObject({
     status: 401,
     message: 'E-posta veya parola hatalı.', 
    });
  });


  it('createItem creates an item and trims name', () => {
    mockPrepare.run.mockReturnValue({ lastInsertRowid: 1 });
    mockPrepare.get.mockReturnValue({ id: 1, name: 'Klavye', quantity: 3, price: 2500, created_by: 10 });

    const item = createItem({
        name: '  Klavye  ',
        description: 'Mekanik',
        quantity: 3,
        price: 2500,
      },
      10
    );

    expect(item.name).toBe('Klavye'); 
    expect(item.id).toBe(1);
  });

  it('getItemById returns item', () => {
    mockPrepare.get.mockReturnValue({ id: 1, name: 'Laptop' });

    const item = getItemById(1);
    expect(item.name).toBe('Laptop');
  });

  it('getItemById throws 404 when item does not exist', () => {
    mockPrepare.get.mockReturnValue(undefined);

    expect(() => getItemById(999)).toThrow();
  });

  it('getAllItems returns items', () => {
    mockPrepare.all.mockReturnValue([
      { id: 1, name: 'Monitör' },
      { id: 2, name: 'Mouse' },
    ]);

    const items = getAllItems();
    expect(items.length).toBe(2);
  });

  it('updateItem updates selected fields', () => {
    mockPrepare.get
      .mockReturnValueOnce({ id: 1, name: 'Telefon', price: 15000 }) // İlk bulma
      .mockReturnValueOnce({ id: 1, name: 'Telefon Pro', price: 18000 }); // Güncel hal

    mockPrepare.run.mockReturnValue({ changes: 1 });

    const updated = updateItem(1, { name: 'Telefon Pro', price: 18000 });
    expect(updated.name).toBe('Telefon Pro');
  });

  it('deleteItem calls delete query', () => {
    mockPrepare.get.mockReturnValue({ id: 1 }); // Silmeden önce var mı kontrolü
    mockPrepare.run.mockReturnValue({ changes: 1 });

    deleteItem(1);
    expect(mockPrepare.run).toHaveBeenCalled();
  });
});