// backend/src/product/repositories/product.repositories.mjs
import { Product } from "../models/product.model.mjs";




export async function findProducts({ category, page, limit }) {
  const filter = {};
  if (category) filter.category = category;

  const skip = (page - 1) * limit;

  const [total, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter).skip(skip).limit(limit)
  ]);

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    products
  };
}
