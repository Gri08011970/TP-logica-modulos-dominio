import { validationResult } from "express-validator";

export function validateOr400(req, res, next) {
  const errs = validationResult(req);
  if (errs.isEmpty()) return next();
  return res.status(400).json({ errors: errs.array(), message: "HTTP 400" });
}
