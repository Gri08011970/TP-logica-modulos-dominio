import { Router } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";

import {
  registerHandler,
  loginHandler,
  logoutHandler,
  profileHandler,
} from "../handlers/user.handlers.mjs";

import { validateOr400 } from "../../shared/middlewares/validation.mjs";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// authRequired para /profile 
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

// Validaciones
const registerValidators = [
  body("name").trim().isLength({ min: 2 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("phone")
    .optional({ checkFalsy: true, nullable: true })
    .trim()
    .isLength({ min: 6 }),
  validateOr400,
];

const loginValidators = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 1 }),
  validateOr400,
];

// Rutas finales:
// POST /api/auth/signup
// POST /api/auth/login
// POST /api/auth/logout
// GET  /api/auth/profile
router.post("/signup", registerValidators, registerHandler);
router.post("/login", loginValidators, loginHandler);
router.post("/logout", authRequired, logoutHandler);
router.get("/profile", authRequired, profileHandler);

export default router;
