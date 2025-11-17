import crypto from "node:crypto";
import { Product } from "../models/product.model.mjs";
import { findProducts } from "../repositories/product.repositories.mjs";
import { formatPagination } from "../../shared/utils/formatPagination.mjs";
import { logger } from "../../shared/utils/logger.mjs";

/**
 * GET /api/products
 * Lista con filtros + paginado (category, subcategory, page, limit)
 */
export async function listProductsHandler(req, res) {
  try {
    const { category, subcategory, page = 1, limit = 6 } = req.query;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 6;

    logger.info("Listando productos", {
      page: pageNum,
      limit: limitNum,
      category,
      subcategory,
    });

    // Usamos repositorio actual
    const { products, total, totalPages } = await findProducts({
      category,
      subcategory,
      page: pageNum,
      limit: limitNum,
    });

    // Adaptado al helper genérico de paginación
    const payload = formatPagination({
      docs: products,
      totalDocs: total,
      page: pageNum,
      limit: limitNum,
      extra: { totalPages },
    });

    return res.json(payload);
  } catch (err) {
    logger.error("[listProductsHandler] error:", err);
    return res
      .status(500)
      .json({ message: "Error interno al listar productos" });
  }
}

// Alias para mantener compatibilidad con el nombre anterior
export const getAllProducts = listProductsHandler;

/**
 * GET /api/products/:id
 * Detalle por campo `id` (el string 313/314/etc), NO por _id.
 */
export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ id: String(id) }).lean();

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json(product);
  } catch (err) {
    logger.error("[getProductById] error:", err);
    return res
      .status(500)
      .json({ message: "Error interno al obtener producto" });
  }
}

// POST /api/products
export async function createProduct(req, res) {
  try {
    const data = req.body || {};

    if (!data.id) {
      data.id = crypto.randomUUID().slice(0, 8);
    }

    if (data.category) {
      data.category = String(data.category).trim().toLowerCase();
    }
    if (data.subcategory) {
      data.subcategory = String(data.subcategory).trim().toLowerCase();
    }

    const created = await Product.create(data);
    return res.status(201).json(created);
  } catch (err) {
    logger.error("[createProduct] error:", err);
    return res
      .status(500)
      .json({ message: "Error interno al crear producto" });
  }
}

// PUT /api/products/:id
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const data = req.body || {};

    if (data.category) {
      data.category = String(data.category).trim().toLowerCase();
    }
    if (data.subcategory) {
      data.subcategory = String(data.subcategory).trim().toLowerCase();
    }

    const updated = await Product.findOneAndUpdate(
      { id: String(id) },
      data,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json(updated);
  } catch (err) {
    logger.error("[updateProduct] error:", err);
    return res
      .status(500)
      .json({ message: "Error interno al actualizar producto" });
  }
}

/**
 * DELETE /api/products/:id
 */
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await Product.deleteOne({ id: String(id) });
    return res.sendStatus(204);
  } catch (err) {
    logger.error("[deleteProduct] error:", err);
    return res
      .status(500)
      .json({ message: "Error interno al eliminar producto" });
  }
}

// Aliases con sufijo Handler para usarlos desde las rutas nuevas
export const getProductByIdHandler = getProductById;
export const createProductHandler = createProduct;
export const updateProductHandler = updateProduct;
export const deleteProductHandler = deleteProduct;
