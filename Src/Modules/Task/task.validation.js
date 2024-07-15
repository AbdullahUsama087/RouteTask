import Joi from "joi";
import { generalFields } from "../../Middlewares/validation.js";

const addTaskValidation = {
  body: Joi.object({
    title: Joi.string().min(5).max(25).required(),
    privacy: Joi.string().valid("private", "public").optional(),
    textTask: Joi.string().min(10).max(500).optional(),
  }).required(),
};

const updateTaskValidation = {
  body: Joi.object({
    title: Joi.string().min(5).max(25).optional(),
    privacy: Joi.string().valid("private", "public").optional(),
    textTask: Joi.string().min(10).max(500).optional(),
  }).required(),
  params: Joi.object({
    taskId: generalFields.id.required(),
    categoryId: generalFields.id,
  }).required(),
};

const deleteTaskValidation = {
  params: Joi.object({
    taskId: generalFields.id,
    categoryId: generalFields.id,
  })
    .required()
    .options({ presence: "required" }),
};

export { addTaskValidation, updateTaskValidation, deleteTaskValidation };
