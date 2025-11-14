// backend/src/product/handlers/product.handlers.mjs
import { Product } from "../../../models/product.mjs";
import { findProducts } from "../repositories/product.repositories.mjs";

/**
 * GET /api/products
 * Lista con filtros + paginado (category, subcategory, page, limit)
 */
export async function getAllProducts(req, res) {
  try {
    const { category, subcategory, page = 1, limit = 6 } = req.query;

    const { products, total, totalPages } = await findProducts({
      category,
      subcategory,
      page: Number(page) || 1,
      limit: Number(limit) || 6,
    });

    res.json({
      total,
      page: Number(page) || 1,
      totalPages,
      products,
    });
  } catch (err) {
    console.error("[getAllProducts] error:", err);
    res.status(500).json({ message: "Error al listar productos" });
  }
}

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

    res.json(product);
  } catch (err) {
    console.error("[getProductById] error:", err);
    res.status(500).json({ message: "Error al obtener producto" });
  }
}

/**
 * POST /api/products
 */
export async function createProduct(req, res) {
  try {
    const data = req.body || {};
    if (!data.id) {
      data.id = crypto.randomUUID().slice(0, 8);
    }
    const created = await Product.create(data);
    res.status(201).json(created);
  } catch (err) {
    console.error("[createProduct] error:", err);
    res.status(500).json({ message: "Error al crear producto" });
  }
}

/**
 * PUT /api/products/:id
 */
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updated = await Product.findOneAndUpdate(
      { id: String(id) },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(updated);
  } catch (err) {
    console.error("[updateProduct] error:", err);
    res.status(500).json({ message: "Error al actualizar producto" });
  }
}

/**
 * DELETE /api/products/:id
 */
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await Product.deleteOne({ id: String(id) });
    res.sendStatus(204);
  } catch (err) {
    console.error("[deleteProduct] error:", err);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
}
