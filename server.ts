import "dotenv/config";
import app from "./src/server/app";
import { getDb } from "./src/server/config/db";

const PORT = process.env.PORT ?? 3000;

getDb();

app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
});