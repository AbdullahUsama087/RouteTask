import categoryModel from "../../../DataBase/Models/category.model.js";
import taskModel from "../../../DataBase/Models/task.model.js";
import ApiFeatures from "../../Utils/apiFeatures.js";
import paginationFunction from "../../Utils/pagination.js";

// ===================== Add Task =================

const addTask = async (req, res, next) => {
  const { title, privacy, textTask } = req.body;
  const { _id } = req.authUser;
  const { categoryId } = req.params;

  if (!title) {
    return next(new Error("Please enter a title for the task", { cause: 400 }));
  }

  // Check if the category exists
  const findCategory = await categoryModel.findOne({
    _id: categoryId,
    createdBy: _id,
  });
  if (!findCategory) {
    return next(new Error("Invalid CategoryId", { cause: 400 }));
  }

  // Check the title is unique
  const findTask = await taskModel.findOne({ title });
  if (findTask) {
    return next(
      new Error("This title is already used, Please Choose a different one", {
        cause: 400,
      })
    );
  }

  // Create Task Object
  const taskObject = {
    title,
    solvedBy: _id,
    privacy,
    categoryId,
    textTask,
  };
  const task = await taskModel.create(taskObject);

  // Check if No Task Object created
  if (!task) {
    return next(
      new Error("Fail to Add Task, Please try again", { cause: 400 })
    );
  }
  res.status(200).json({ message: "Task Added successfully", task });
};

// ===================== Update Task =================

const updateTask = async (req, res, next) => {
  const { taskId, categoryId } = req.params;
  const { title, textTask } = req.body;
  const { _id } = req.authUser;

  // Check if the category exists
  const findCategory = await categoryModel.findOne({
    _id: categoryId,
    createdBy: _id,
  });
  if (!findCategory) {
    return next(new Error("Invalid CategoryId", { cause: 400 }));
  }

  // Check if Task exists by ID
  const task = await taskModel.findOne({
    _id: taskId,
    solvedBy: _id,
  });
  if (!task) {
    return next(new Error("Invalid TaskID", { cause: 400 }));
  }

  // Check on Title
  if (title) {
    //check that new title is different from the old name
    if (task.title == title) {
      return next(
        new Error(
          "you entered the same Task title,Please enter a different one",
          {
            cause: 400,
          }
        )
      );
    }

    //check the new title is unique
    const findTask = await taskModel.findOne({ title });
    if (findTask) {
      return next(
        new Error("This title is already used please enter a different one", {
          cause: 400,
        })
      );
    }

    // Update title
    task.title = title;
    task.textTask = textTask;
  }

  // Update userId who Updates the Task
  task.updatedBy = _id;
  await task.save();
  res.status(200).json({ message: "Task updated successfully", task });
};

// ===================== Get All Tasks =================

const getAllTasks = async (req, res, next) => {
  const { _id } = req.authUser;
  const { page, size } = req.query;
  const { limit, skip } = paginationFunction({ page, size });
  const Tasks = await taskModel
    .find({ solvedBy: _id })
    .populate([
      {
        path: "categoryId",
        select: "name -_id",
      },
    ])
    .limit(limit) // Using Pagination
    .skip(skip);
  if (getAllTasks.length) {
    res.status(200).json({ message: "Done", Tasks });
  } else {
    next(new Error("No Tasks found", { cause: 400 }));
  }
};

// ===================== List Tasks =================

const listTasks = async (req, res, next) => {
  const { _id } = req.authUser;
  const ApiFeaturesInstance = new ApiFeatures(
    taskModel.find({ createdBy: _id }),
    req.query
  ).filters(); // Using Filters

  // Sort
  // const tasks = await taskModel.find().sort(sort.replaceAll("&", " "));

  // Select
  // const tasks = await taskModel.find().select(select.replaceAll("&", " "));

  /* Search
  const tasks = await taskModel.find({
    $or: [
      { title: { $regex: search, $options: "i" } },
      { desc: { $regex: search, $options: "i" } },
    ],
  });
  */

  const tasks = await ApiFeaturesInstance.mongooseQuery;
  if (tasks.length) {
    res.status(200).json({ message: "Done", tasks });
  } else {
    next(new Error("No tasks found", { cause: 400 }));
  }
};

// ===================== Delete Task =================

const deleteTask = async (req, res, next) => {
  const { taskId, categoryId } = req.params;
  const { _id } = req.authUser;

  // Check if the category exists
  const findCategory = await categoryModel.findOne({
    _id: categoryId,
    createdBy: _id,
  });
  if (!findCategory) {
    return next(new Error("Invalid CategoryId", { cause: 400 }));
  }

  // Check if task is exists and Delete from DataBase
  const taskExists = await taskModel.findOneAndDelete({
    _id: taskId,
    solvedBy: _id,
  });
  if (!taskExists) {
    return next(new Error("Invalid TaskId", { cause: 400 }));
  }

  res.status(200).json({ message: "Task deleted successfully" });
};

export { addTask, updateTask, getAllTasks, listTasks, deleteTask };
