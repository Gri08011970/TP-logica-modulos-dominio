// backend/src/order/routes/order.routes.mjs
import { Router } from "express";
import { body } from "express-validator";
import { validateOr400 } from "../../shared/middlewares/validation.mjs";

// Middlewares compartidos
import {
  authRequired,
  adminOnly,
} from "../../shared/middlewares/auth.mjs";

import {
  listOrdersHandler,
  getOrderByIdHandler,
  createOrderHandler,
  updateOrderHandler,
  updateOrderStatusHandler,
  deleteOrderHandler,
} from "../handlers/order.handlers.mjs";

const router = Router();

// ---- helpers de validación ----
const STATUS = ["pendiente", "pagado", "enviado", "cancelado"];

const validateOrderCreateOrPut = [
  body("customer").trim().isLength({ min: 2 }),
  body("email").isEmail().normalizeEmail(),
  body("phone")
    .optional({ checkFalsy: true, nullable: true })
    .trim()
    .isLength({ min: 6 }),
  body("total").isFloat({ min: 0 }),
  body("status").isIn(STATUS),
  body("items").optional().isArray(),
  validateOr400,
];

const validateOrderStatusPatch = [
  body("status").isIn(STATUS),
  validateOr400,
];

// ================== Rutas de Orders ==================

// LIST with filters: ?status=...&from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/", authRequired, adminOnly, listOrdersHandler);

// GET detalle
router.get("/:id", authRequired, adminOnly, getOrderByIdHandler);

// POST crear
router.post("/", authRequired, validateOrderCreateOrPut, createOrderHandler);

// PUT actualizar
router.put(
  "/:id",
  authRequired,
  adminOnly,
  validateOrderCreateOrPut,
  updateOrderHandler
);

// PATCH estado (o campos parciales)
router.patch(
  "/:id",
  authRequired,
  adminOnly,
  validateOrderStatusPatch,
  updateOrderStatusHandler
);

// DELETE borrar / cancelar
router.delete("/:id", authRequired, adminOnly, deleteOrderHandler);

export default router;
