import { Router } from "express";
import { register, login, logout } from "./auth.controller";

const router = Router();

router.get("/me", (req, res) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Oturum açılmamış." });
  }
  res.json({ user: { id: req.session.userId, role: req.session.role } });
});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;