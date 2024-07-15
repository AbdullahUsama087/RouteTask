import Joi from "joi";
import { generalFields } from "../../Middlewares/validation.js";

const addCategoryValidation = {
  body: Joi.object({
    name: Joi.string().min(5).max(25).required(),
  }).options({ presence: "required" }),
};

const deleteCategoryValidation = {
  query: Joi.object({
    categoryId: generalFields.id,
  }).options({ presence: "required" }),
};

export {
  addCategoryValidation,
  deleteCategoryValidation,
};
