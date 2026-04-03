import "dotenv/config";
import express from "express";
import cors from "cors"; // npm install cors
import app from "./src/server/app";
import { getDb } from "./src/server/config/db";

const PORT = process.env.PORT ?? 3000;

// CORS ayarı: Frontend portun 5173 (veya değişen son port) ise ona göre güncelle
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, // Session çerezlerinin (cookie) taşınması için kritik
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));

getDb();

app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});