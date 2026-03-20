import express from "express";
import session from "express-session";
import connectSqlite3 from "connect-sqlite3";
import authRouter from "./modules/auth/auth.router";
import itemRouter from "./modules/item/item.router";
import adminRouter from "./modules/admin/admin.router";

const SQLiteStore = connectSqlite3(session);

const app = express();

app.use(express.json());

app.use(
  session({
    store: new (SQLiteStore as any)({ db: "sessions.db", dir: "./" }),
    secret: process.env.SESSION_SECRET ?? "fallback-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/api/auth", authRouter);
app.use("/api/items", itemRouter);
app.use("/api/admin", adminRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Uçnokta bulunamadı." });
});

export default app;