// backend/src/shared/middlewares/auth.mjs
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// Requiere que haya un token válido en Authorization: Bearer <token>
export function authRequired(req, res, next) {
  try {
    const auth = req.header("Authorization") || "";
    const [, token] = auth.split(" ");

    if (!token) {
      return res.status(401).json({ message: "Token requerido" });
    }

    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
}

// Sólo permite admins
export function adminOnly(req, res, next) {
  if (req.user?.role === "admin") return next();
  return res.status(403).json({ message: "Solo para administradores" });
}
