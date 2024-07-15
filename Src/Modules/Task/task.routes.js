import { Router } from "express";

import isAuth from "../../Middlewares/authentication.js";
import taskApisRoles from "./task.endpoints.js";

import * as taskControllers from "./task.controller.js";
import { asyncHandler } from "../../Utils/errorhandling.js";

import * as taskValidators from "./task.validation.js";
import { validationCoreFunction } from "../../Middlewares/validation.js";

const router = Router();

router.post(
  "/add/:categoryId",
  isAuth(taskApisRoles.ADD_TASK_ROLE),
  validationCoreFunction(taskValidators.addTaskValidation),
  asyncHandler(taskControllers.addTask)
);

router.patch(
  "/update/:categoryId/:taskId",
  isAuth(taskApisRoles.ADD_TASK_ROLE),
  validationCoreFunction(taskValidators.updateTaskValidation),
  asyncHandler(taskControllers.updateTask)
);

router.get(
  "/get",
  isAuth(taskApisRoles.ADD_TASK_ROLE),
  asyncHandler(taskControllers.getAllTasks)
);

router.delete(
  "/delete/:categoryId/:taskId",
  isAuth(taskApisRoles.ADD_TASK_ROLE),
  validationCoreFunction(taskValidators.deleteTaskValidation),
  asyncHandler(taskControllers.deleteTask)
);

export default router;
