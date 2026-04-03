import { Request, Response, NextFunction } from "express";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.session?.userId) {
    res.status(401).json({ message: "Giriş yapmanız gerekiyor." });
    return;
  }
  next();
}

export function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.session?.userId) {
    res.status(401).json({ message: "Giriş yapmanız gerekiyor." });
    return;
  }
  if (req.session.role !== "admin") {
    res.status(403).json({ message: "Bu işlem için yönetici yetkisi gerekiyor." });
    return;
  }
  next();
}