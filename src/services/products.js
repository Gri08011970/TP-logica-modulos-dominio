// src/services/products.js
import { API_URL, apiFetch } from "./api.js";

/**
 * Devuelve: { items, total, totalPages }
 */
export async function listProducts(params = {}) {
  const { page = 1, limit = 10, category, subcategory } = params;

  const usp = new URLSearchParams();
  if (category) usp.set("category", category);
  if (subcategory) usp.set("subcategory", subcategory);

  // soporta ambos estilos de paginado
  usp.set("_page", String(page));
  usp.set("_limit", String(limit));
  usp.set("page", String(page));
  usp.set("limit", String(limit));

  const url = `${API_URL}/products?${usp.toString()}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();

  let items = [];
  let total = 0;
  let totalPages = 1;

  // 🧩 MODO 1: respuesta tipo json-server => array + X-Total-Count
  if (Array.isArray(data)) {
    items = data;
    const totalHeader = res.headers.get("X-Total-Count");
    total = totalHeader ? Number(totalHeader) : items.length;
    totalPages = Math.max(1, Math.ceil(total / limit));
  }
  // 🧩 MODO 2: respuesta de nuestro backend Mongo => { total, page, totalPages, products }
  else if (data && Array.isArray(data.products)) {
    items = data.products;

    // total puede venir como number o string
    if (typeof data.total === "number") {
      total = data.total;
    } else if (data.total) {
      total = Number(data.total);
    } else {
      total = items.length;
    }

    if (typeof data.totalPages === "number") {
      totalPages = data.totalPages;
    } else if (data.totalPages) {
      totalPages = Number(data.totalPages);
    } else {
      totalPages = Math.max(1, Math.ceil(total / limit));
    }
  } else {
    // Por si alguna vez cambia la API, al menos lo vemos en consola
    console.warn("Respuesta inesperada en listProducts:", data);
    items = [];
    total = 0;
    totalPages = 1;
  }

  return { items, total, totalPages };
}

/** Lecturas “de catálogo”  */
export async function getProductsPaginated(params = {}) {
  const { page = 1, limit = 6, category, subcategory } = params;
  const { items, total, totalPages } = await listProducts({
    page,
    limit,
    category,
    subcategory,
  });
  return { items, total, totalPages };
}

export async function getProducts(params = {}) {
  const { items } = await getProductsPaginated(params);
  return items;
}

export async function getProductById(id) {
  return apiFetch(`/products/${encodeURIComponent(id)}`);
}

// Alias que ya importábamos
export const getProduct = getProductById;

/** CRUD admin */
export async function createProduct(payload) {
  return apiFetch("/products", { method: "POST", body: payload });
}

export async function updateProduct(id, payload) {
  return apiFetch(`/products/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteProduct(id) {
  return apiFetch(`/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}


