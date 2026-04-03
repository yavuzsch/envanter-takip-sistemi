import { Request, Response } from "express";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "./item.service";

export function listItems(req: Request, res: Response): void {
  try {
    const items = getAllItems();
    res.status(200).json(items);
  } catch (err: any) {
    res.status(err.status ?? 500).json({ message: err.message ?? "Sunucu hatası." });
  }
}

export function getItem(req: Request, res: Response): void {
  try {
    const item = getItemById(Number(req.params.id));
    res.status(200).json(item);
  } catch (err: any) {
    res.status(err.status ?? 500).json({ message: err.message ?? "Sunucu hatası." });
  }
}

export function createItemHandler(req: Request, res: Response): void {
  try {
    const item = createItem(req.body, req.session.userId!);
    res.status(201).json(item);
  } catch (err: any) {
    res.status(err.status ?? 500).json({ message: err.message ?? "Sunucu hatası." });
  }
}

export function updateItemHandler(req: Request, res: Response): void {
  try {
    const item = updateItem(Number(req.params.id), req.body);
    res.status(200).json(item);
  } catch (err: any) {
    res.status(err.status ?? 500).json({ message: err.message ?? "Sunucu hatası." });
  }
}

export function deleteItemHandler(req: Request, res: Response): void {
  try {
    deleteItem(Number(req.params.id));
    res.status(204).send();
  } catch (err: any) {
    res.status(err.status ?? 500).json({ message: err.message ?? "Sunucu hatası." });
  }
}