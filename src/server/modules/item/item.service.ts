import { getDb } from "../../config/db";

interface Item {
  id: number;
  name: string;
  description: string | null;
  quantity: number;
  price: number;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export function getAllItems(): Item[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM items ORDER BY created_at DESC")
    .all() as Item[];
}

export function getItemById(id: number): Item {
  const db = getDb();
  const item = db
    .prepare("SELECT * FROM items WHERE id = ?")
    .get(id) as Item | undefined;

  if (!item) {
    throw { status: 404, message: "Kayıt bulunamadı." };
  }

  return item;
}

export function createItem(
  data: { name: string; description?: string; quantity: number; price: number },
  userId: number
): Item {
  const db = getDb();

  const result = db
    .prepare(`
      INSERT INTO items (name, description, quantity, price, created_by)
      VALUES (?, ?, ?, ?, ?)
    `)
    .run(data.name.trim(), data.description ?? null, data.quantity, data.price, userId);

  return getItemById(Number(result.lastInsertRowid));
}

export function updateItem(
  id: number,
  data: { name?: string; description?: string; quantity?: number; price?: number }
): Item {
  getItemById(id);

  const db = getDb();
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    values.push(data.name.trim());
  }
  if (data.description !== undefined) {
    fields.push("description = ?");
    values.push(data.description);
  }
  if (data.quantity !== undefined) {
    fields.push("quantity = ?");
    values.push(data.quantity);
  }
  if (data.price !== undefined) {
    fields.push("price = ?");
    values.push(data.price);
  }

  if (fields.length === 0) {
    throw { status: 400, message: "Güncellenecek alan belirtilmedi." };
  }

  fields.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE items SET ${fields.join(", ")} WHERE id = ?`).run(...values);

  return getItemById(id);
}

export function deleteItem(id: number): void {
  getItemById(id);
  const db = getDb();
  db.prepare("DELETE FROM items WHERE id = ?").run(id);
}