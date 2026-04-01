import bcrypt from "bcrypt";
import { getDb } from "../../config/db";

interface User {
  id: number;
  email: string;
  password: string;
  role: string;
}

export async function registerUser(
  email: string,
  password: string
): Promise<{ id: number; email: string; role: string }> {
  const db = getDb();

  if (!email || !password) {
    throw { status: 400, message: "E-posta ve parola zorunludur." };
  }
  if (password.length < 6) {
    throw { status: 400, message: "Parola en az 6 karakter olmalıdır." };
  }

  const existing = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email);

  if (existing) {
    throw { status: 409, message: "Bu e-posta zaten kayıtlı." };
  }

  const hash = await bcrypt.hash(password, 10);

  const result = db
    .prepare("INSERT INTO users (email, password, role) VALUES (?, ?, 'user')")
    .run(email, hash);

  return { id: Number(result.lastInsertRowid), email, role: "user" };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ id: number; email: string; role: string }> {
  const db = getDb();

  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email) as User | undefined;

  if (!user) {
    throw { status: 401, message: "E-posta veya parola hatalı." };
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw { status: 401, message: "E-posta veya parola hatalı." };
  }

  return { id: user.id, email: user.email, role: user.role };
}