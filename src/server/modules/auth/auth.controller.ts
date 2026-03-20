import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const user = await registerUser(email, password);
    res.status(201).json({ message: "Kayıt başarılı.", user });
  } catch (err: any) {
    res.status(err.status ?? 500).json({ message: err.message ?? "Sunucu hatası." });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);

    req.session.userId = user.id;
    req.session.role = user.role;

    res.status(200).json({ message: "Giriş başarılı.", user });
  } catch (err: any) {
    res.status(err.status ?? 500).json({ message: err.message ?? "Sunucu hatası." });
  }
}

export function logout(req: Request, res: Response): void {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: "Çıkış yapılırken hata oluştu." });
      return;
    }
    res.clearCookie("connect.sid");
    res.status(204).send();
  });
}