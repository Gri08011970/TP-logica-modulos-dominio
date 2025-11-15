import mongoose from "mongoose";

export const validateId = (id = "") => {
  return mongoose.Types.ObjectId.isValid(id);
};
