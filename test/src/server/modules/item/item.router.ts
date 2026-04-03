import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth";
import { validateCreateItem, validateUpdateItem } from "../../middleware/validate";
import {
  listItems,
  getItem,
  createItemHandler,
  updateItemHandler,
  deleteItemHandler,
} from "./item.controller";

const router = Router();

router.use(isAuthenticated);

router.get("/", listItems);
router.get("/:id", getItem);
router.post("/", validateCreateItem, createItemHandler);
router.patch("/:id", validateUpdateItem, updateItemHandler);
router.delete("/:id", deleteItemHandler);

export default router;