import { Request, Response } from "express";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "./item.service";

type AppError = { status?: number; message?: string };

export function listItems(req: Request, res: Response): void {
  try {
    const items = getAllItems();
    res.status(200).json(items);
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ message: appErr.message ?? "Sunucu hatası." });
  }
}

export function getItem(req: Request, res: Response): void {
  try {
    const item = getItemById(Number(req.params.id));
    res.status(200).json(item);
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ message: appErr.message ?? "Sunucu hatası." });
  }
}

export function createItemHandler(req: Request, res: Response): void {
  try {
    const item = createItem(req.body, req.session.userId!);
    res.status(201).json(item);
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ message: appErr.message ?? "Sunucu hatası." });
  }
}

export function updateItemHandler(req: Request, res: Response): void {
  try {
    const item = updateItem(Number(req.params.id), req.body);
    res.status(200).json(item);
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ message: appErr.message ?? "Sunucu hatası." });
  }
}

export function deleteItemHandler(req: Request, res: Response): void {
  try {
    deleteItem(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ message: appErr.message ?? "Sunucu hatası." });
  }
}