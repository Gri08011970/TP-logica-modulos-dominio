import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../handlers/product.handlers.mjs";

const router = Router();

// Listado general + por categoría + paginado
router.get("/", getAllProducts);

// Detalle
router.get("/:id", getProductById);

// Crear producto (admin)
router.post("/", createProduct);

// Editar producto
router.put("/:id", updateProduct);

// Eliminar producto
router.delete("/:id", deleteProduct);

export default router;
