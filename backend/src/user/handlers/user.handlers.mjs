import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { validationResult } from "express-validator";
import { User } from "../models/user.model.mjs";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@tienda.com").toLowerCase();

const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

/**
 * POST /api/auth/signup
 */
export async function registerHandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: "HTTP 400" });
    }

    const { name, email, password, phone } = req.body || {};
    const emailL = (email || "").toLowerCase();

    const exists = await User.findOne({ email: emailL });
    if (exists) {
      return res.status(409).json({ message: "Email ya registrado" });
    }

    const hash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID().slice(0, 8);
    const role = emailL === ADMIN_EMAIL ? "admin" : "user";

    await User.create({
      id,
      name,
      email: emailL,
      password: hash,
      phone: phone ? phone.trim() : "",
      role,
    });

    const token = signToken({ id, email: emailL, role, name });

    res.status(201).json({
      user: { id, name, email: emailL, phone: phone || "", role },
      token,
    });
  } catch (err) {
    console.error("[registerHandler] error:", err);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
}

/**
 * POST /api/auth/login
 */
export async function loginHandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: "HTTP 400" });
    }

    const { email, password } = req.body || {};
    const emailL = (email || "").toLowerCase();

    const user = await User.findOne({ email: emailL });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const role = emailL === ADMIN_EMAIL ? "admin" : (user.role || "user");
    if (role !== user.role) {
      user.role = role;
      await user.save();
    }

    const token = signToken({
      id: user.id,
      email: emailL,
      role,
      name: user.name,
      phone: user.phone || "",
    });

    const { id, name, phone } = user;
    res.json({
      user: { id, name, email: emailL, phone: phone || "", role },
      token,
    });
  } catch (err) {
    console.error("[loginHandler] error:", err);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
}

/**
 * POST /api/auth/logout
 * (stateless: sólo respondemos 204)
 */
export async function logoutHandler(_req, res) {
  res.sendStatus(204);
}

/**
 * GET /api/auth/profile
 */
export async function profileHandler(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const user = await User.findOne({ id: userId }).lean();
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const { id, name, email, phone, role } = user;
    res.json({ id, name, email, phone: phone || "", role });
  } catch (err) {
    console.error("[profileHandler] error:", err);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
}
