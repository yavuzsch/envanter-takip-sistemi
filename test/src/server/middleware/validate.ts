import { Request, Response, NextFunction } from "express";

export interface ItemBody {
  name?: unknown;
  description?: unknown;
  quantity?: unknown;
  price?: unknown;
}

export function validateCreateItem(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { name, quantity, price } = req.body as ItemBody;

  const errors: string[] = [];

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("name zorunludur.");
  } else if (name.trim().length > 100) {
    errors.push("name en fazla 100 karakter olabilir.");
  }

  if (quantity === undefined || quantity === null) {
    errors.push("quantity zorunludur.");
  } else if (!Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
    errors.push("quantity sıfır veya pozitif tam sayı olmalıdır.");
  }

  if (price === undefined || price === null) {
    errors.push("price zorunludur.");
  } else if (isNaN(Number(price)) || Number(price) < 0) {
    errors.push("price sıfır veya pozitif sayı olmalıdır.");
  }

  if (errors.length > 0) {
    res.status(400).json({ message: "Validasyon hatası.", errors });
    return;
  }

  next();
}

export function validateUpdateItem(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { name, quantity, price } = req.body as ItemBody;
  const errors: string[] = [];

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      errors.push("name boş olamaz.");
    } else if (name.trim().length > 100) {
      errors.push("name en fazla 100 karakter olabilir.");
    }
  }

  if (quantity !== undefined) {
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
      errors.push("quantity sıfır veya pozitif tam sayı olmalıdır.");
    }
  }

  if (price !== undefined) {
    if (isNaN(Number(price)) || Number(price) < 0) {
      errors.push("price sıfır veya pozitif sayı olmalıdır.");
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ message: "Validasyon hatası.", errors });
    return;
  }

  next();
}