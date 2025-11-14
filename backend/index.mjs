import express from "express";
import morgan from "morgan";
import jsonServer from "json-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";
dotenv.config();

// Routers modulares (modo MONGO)
import userRoutes from "./src/user/routes/user.routes.mjs";
import productRoutes from "./src/product/routes/product.routes.mjs";
import orderRoutes from "./src/order/routes/order.routes.mjs";

// ------------------- CONFIG MONGO -------------------
const rawUseMongo = process.env.USE_MONGO;
const USE_MONGO =
  typeof rawUseMongo === "string" &&
  rawUseMongo.trim().toLowerCase() === "true";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("[BOOT] USE_MONGO raw:", rawUseMongo);
console.log("[BOOT] USE_MONGO resolved:", USE_MONGO);
console.log("[BOOT] MONGO_URL set:", !!process.env.MONGO_URL);

// ------------------- ENV -------------------
const PORT = Number(process.env.PORT || 4001);
const FRONT_ORIGIN = process.env.FRONT_ORIGIN || "";
const LOCAL_ORIGIN = "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// ------------------- APP -------------------
const app = express();

// CORS antes de todo
app.use((req, res, next) => {
  const allowed = [FRONT_ORIGIN, LOCAL_ORIGIN].filter(Boolean);
  const origin = req.headers.origin;

  if (!origin || allowed.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin || allowed[0] || "*");
    res.header("Access-Control-Allow-Credentials", "true");
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    req.header("Access-Control-Request-Headers") ||
      "Content-Type, Authorization"
  );
  res.header("Vary", "Origin");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Logs + JSON
app.use(morgan("dev"));
app.use(express.json());

// ------------------- STATIC IMAGES -------------------
const imagesDir = path.join(__dirname, "..", "public", "images");
console.log("[IMAGES DIR]", imagesDir);
app.use("/images", express.static(imagesDir));

// ------------------- VALIDATOR HELPER -------------------
function validateOr400(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(400).json({ errors: errors.array(), message: "HTTP 400" });
}

// ------------------- MODO MONGO -------------------
if (USE_MONGO) {
  const { connectDB } = await import("./db.mjs");
  await connectDB(process.env.MONGO_URL);

  console.log("MongoDB conectado");

  // Montamos routers modulares
  app.use("/api/auth", userRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);

  // (opcional) montar tus rutas legacy si hacen falta
}

// ------------------- MODO JSON -------------------
else {
  const router = jsonServer.router(path.join(__dirname, "..", "db.json"));
  const middlewares = jsonServer.defaults();
  const db = router.db;

  // Helpers para JSON mode
  const signToken = (payload) =>
    jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

  function authRequired(req, res, next) {
    try {
      const auth = req.header("Authorization") || "";
      const [, token] = auth.split(" ");
      if (!token) return res.status(401).json({ message: "Token requerido" });
      req.user = jwt.verify(token, JWT_SECRET);
      next();
    } catch {
      return res.status(401).json({ message: "Token inválido" });
    }
  }

  function adminOnly(req, res, next) {
    if (req.user?.role === "admin") return next();
    return res.status(403).json({ message: "Solo para administradores" });
  }

  // -------- AUTH JSON --------
  app.post(
    "/api/auth/login",
    [
      body("email").isEmail(),
      body("password").isLength({ min: 1 }),
      validateOr400,
    ],
    async (req, res) => {
      const { email, password } = req.body || {};
      const emailL = (email || "").toLowerCase();
      const user = db.get("users").find({ email: emailL }).value();

      if (!user) return res.status(401).json({ message: "Credenciales inválidas" });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

      const token = signToken(user);
      res.json({ user, token });
    }
  );

  app.use("/api", middlewares, router);
}

// ------------------- FRONTEND BUILD -------------------
const distPath = path.join(__dirname, "..", "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ------------------- ERROR HANDLER -------------------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Error del servidor" });
});

// ------------------- START -------------------
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}/api (USE_MONGO=${USE_MONGO})`);
});
