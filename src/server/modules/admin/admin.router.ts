import { Router, Request, Response } from "express";
import { isAdmin } from "../../middleware/auth";
import { getDb } from "../../config/db";

const router = Router();

router.get("/report", isAdmin, (req: Request, res: Response) => {
  const db = getDb();

  const totalItems = (
    db.prepare("SELECT COUNT(*) as count FROM items").get() as { count: number }
  ).count;

  const totalUsers = (
    db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number }
  ).count;

  const totalValue = (
    db.prepare("SELECT SUM(quantity * price) as total FROM items").get() as {
      total: number | null;
    }
  ).total ?? 0;

  res.status(200).json({
    totalItems,
    totalUsers,
    totalValue,
  });
});

export default router;