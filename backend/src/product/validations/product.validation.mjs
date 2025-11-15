// backend/src/product/validations/product.validation.mjs
import { body, param, query } from "express-validator";
import { validateOr400 } from "../../shared/middlewares/validation.mjs";


// --- helpers internos ---

// Valida que el :id de la ruta sea un ID de producto no vacío
// (no hace falta que sea ObjectId de Mongo, usamos el campo "id" del schema)
const idParamValidator = param("id")
  .trim()
  .notEmpty()
  .withMessage("ID de producto requerido");


// Campos base que usamos en create y update
const productBaseValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0"),
  body("description")
    .optional()
    .isString()
    .isLength({ max: 2000 })
    .withMessage("La descripción debe ser texto"),
  body("category")
    .optional()
    .isString()
    .withMessage("La categoría debe ser texto"),
  body("subcategory")
    .optional()
    .isString()
    .withMessage("La subcategoría debe ser texto"),
  body("image")
    .optional()
    .isString()
    .withMessage("La imagen debe ser una URL o path válido"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un entero mayor o igual a 0"),
  body("active")
    .optional()
    .isBoolean()
    .withMessage("active debe ser true/false"),
];

// --- VALIDADORES EXPORTADOS ---

// GET /api/products con filtros/paginación
export const validateProductListQuery = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("category").optional().isString(),
  query("search").optional().isString(),
  validateOr400,
];

// GET /api/products/:id
export const validateProductIdParam = [idParamValidator, validateOr400];

// POST /api/products
export const validateProductCreate = [
  ...productBaseValidators,
  validateOr400,
];

// PUT /api/products/:id
export const validateProductUpdate = [
  idParamValidator,
  ...productBaseValidators,
  validateOr400,
];

// DELETE /api/products/:id
export const validateProductDelete = [idParamValidator, validateOr400];
