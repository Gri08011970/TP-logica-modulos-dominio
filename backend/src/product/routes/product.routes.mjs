
import { Router } from "express";

import {
  listProductsHandler,
  getProductByIdHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from "../handlers/product.handlers.mjs";

import {
  authRequired,
  adminOnly,
} from "../../shared/middlewares/auth.mjs";

import {
  validateProductListQuery,
  validateProductIdParam,
  validateProductCreate,
  validateProductUpdate,
  validateProductDelete,
} from "../validations/product.validation.mjs";

const router = Router();

// ================== Rutas públicas ==================

// Lista de productos (con filtros/paginación)
router.get("/", validateProductListQuery, listProductsHandler);

// Detalle de un producto
router.get("/:id", validateProductIdParam, getProductByIdHandler);

// ================== Rutas protegidas (admin) ==================

// Crear producto (solo admin)
router.post(
  "/",
  authRequired,
  adminOnly,
  validateProductCreate,
  createProductHandler
);

// Actualizar producto (solo admin)
router.put(
  "/:id",
  authRequired,
  adminOnly,
  validateProductUpdate,
  updateProductHandler
);

// Eliminar producto (solo admin)
router.delete(
  "/:id",
  authRequired,
  adminOnly,
  validateProductDelete,
  deleteProductHandler
);

export default router;
