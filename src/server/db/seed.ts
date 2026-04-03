import bcrypt from "bcrypt";
import { getDb, closeDb } from "../config/db";

async function seed() {
  const db = getDb();

  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (email, password, role)
    VALUES (?, ?, ?)
  `);

  insertUser.run("admin@inventory.com", adminPassword, "admin");
  insertUser.run("user@inventory.com", userPassword, "user");

  const admin = db.prepare("SELECT id FROM users WHERE email = ?")
    .get("admin@inventory.com") as { id: number };

  const insertItem = db.prepare(`
    INSERT OR IGNORE INTO items (name, description, quantity, price, created_by)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertItem.run("Dizüstü Bilgisayar", "Dell XPS 15", 10, 45000, admin.id);
  insertItem.run("Monitör", "LG 27 inç 4K", 25, 12000, admin.id);
  insertItem.run("Klavye", "Mekanik RGB", 50, 1500, admin.id);
  insertItem.run("Mouse", "Logitech MX Master", 40, 2200, admin.id);

  console.log("Başlangıç verisi yüklendi.");
  console.log("   admin@inventory.com / admin123");
  console.log("   user@inventory.com  / user123");

  closeDb();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Başlangıç verisi hatası:", err);
  process.exit(1);
});