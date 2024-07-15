import { Router } from "express";

const router = Router();

import * as categoryControllers from "./category.controller.js";
import { asyncHandler } from "../../Utils/errorhandling.js";

import * as categoryValidators from "./category.validation.js";
import { validationCoreFunction } from "../../Middlewares/validation.js";

import isAuth from "../../Middlewares/authentication.js";
import categoryApisRoles from "./category.endpoints.js";

router.post(
  "/add",
  isAuth(categoryApisRoles.CATEGORY_ROLE),
  validationCoreFunction(categoryValidators.addCategoryValidation),
  asyncHandler(categoryControllers.addCategory)
);

router.patch(
  "/update",
  isAuth(categoryApisRoles.CATEGORY_ROLE),
  validationCoreFunction(categoryValidators.addCategoryValidation),
  asyncHandler(categoryControllers.updateCategory)
);

router.get(
  "/get",
  isAuth(categoryApisRoles.CATEGORY_ROLE),
  asyncHandler(categoryControllers.getAllCategories)
);

router.get(
  "/sort",
  isAuth(categoryApisRoles.CATEGORY_ROLE),
  asyncHandler(categoryControllers.getAllCategories)
);

router.delete(
  "/delete",
  isAuth(categoryApisRoles.CATEGORY_ROLE),
  validationCoreFunction(categoryValidators.deleteCategoryValidation),
  asyncHandler(categoryControllers.deleteCategory)
);

export default router;
