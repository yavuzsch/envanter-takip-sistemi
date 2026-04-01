import bcrypt from 'bcrypt';
import { getDb } from '../src/server/config/db';

export function resetDatabase(): void {
  const db = getDb();
  db.prepare('DELETE FROM items').run();
  db.prepare('DELETE FROM users').run();
  db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('users','items')").run();
}

export async function createUser(params?: {
  email?: string;
  password?: string;
  role?: 'user' | 'admin';
}) {
  const db = getDb();
  const email = params?.email ?? 'user@example.com';
  const password = params?.password ?? 'secret123';
  const role = params?.role ?? 'user';
  const hash = await bcrypt.hash(password, 10);

  const result = db
    .prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)')
    .run(email, hash, role);

  return {
    id: Number(result.lastInsertRowid),
    email,
    password,
    role,
  };
}
