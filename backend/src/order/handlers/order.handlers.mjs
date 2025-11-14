// backend/src/order/handlers/order.handlers.mjs
import crypto from "node:crypto";
import { Order } from "../../../models/order.mjs";

/**
 * GET /api/orders
 * Lista de órdenes con filtros: ?status=...&from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export async function listOrdersHandler(req, res) {
  const { status, from, to } = req.query || {};
  const filter = {};

  if (status) filter.status = status;

  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
  res.json(orders);
}

/**
 * GET /api/orders/:id
 */
export async function getOrderByIdHandler(req, res) {
  const { id } = req.params;
  const order = await Order.findOne({ id }).lean();

  if (!order) {
    return res.status(404).json({ message: "Orden no encontrada" });
  }

  res.json(order);
}

/**
 * POST /api/orders
 */
export async function createOrderHandler(req, res) {
  const body = req.body || {};

  if (!body.id) body.id = crypto.randomUUID().slice(0, 8);
  if (!body.createdAt) body.createdAt = new Date();
  if (!body.customerName) body.customerName = body.customer || "";

  const created = await Order.create(body);
  res.status(201).json(created);
}

/**
 * PUT /api/orders/:id
 */
export async function updateOrderHandler(req, res) {
  const { id } = req.params;
  const updated = await Order.findOneAndUpdate({ id }, req.body, {
    new: true,
  });

  if (!updated) {
    return res.status(404).json({ message: "Orden no encontrada" });
  }

  res.json(updated);
}

/**
 * PATCH /api/orders/:id
 * Usado para cambiar sólo el estado u otros campos parciales
 */
export async function updateOrderStatusHandler(req, res) {
  const { id } = req.params;
  const updated = await Order.findOneAndUpdate({ id }, req.body, {
    new: true,
  });

  if (!updated) {
    return res.status(404).json({ message: "Orden no encontrada" });
  }

  res.json(updated);
}

/**
 * DELETE /api/orders/:id
 */
export async function deleteOrderHandler(req, res) {
  const { id } = req.params;
  await Order.deleteOne({ id });
  res.sendStatus(204);
}
