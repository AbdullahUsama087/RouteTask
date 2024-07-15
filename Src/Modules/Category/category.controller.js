import categoryModel from "../../../DataBase/Models/category.model.js";
import ApiFeatures from "../../Utils/apiFeatures.js";
import paginationFunction from "../../Utils/pagination.js";

// ===================== Add Category =================

const addCategory = async (req, res, next) => {
  const { name } = req.body;
  const { _id } = req.authUser;

  // Check on Category Name
  if (!name) {
    return next(
      new Error("Please enter a name for the category", { cause: 400 })
    );
  }

  // Check the name is unique
  const findCategory = await categoryModel.findOne({ name });
  if (findCategory) {
    return next(
      new Error("This name is already used, Please Choose a different one", {
        cause: 400,
      })
    );
  }

  // Create Category Object
  const categoryObject = {
    name,
    createdBy: _id,
  };
  const category = await categoryModel.create(categoryObject);

  // Check if No Category Object created
  if (!category) {
    return next(
      new Error("Fail to Add Category, Please try again", { cause: 400 })
    );
  }
  res.status(200).json({ message: "Category Added successfully", category });
};

// ===================== Update Category =================

const updateCategory = async (req, res, next) => {
  const { categoryId } = req.query;
  const { name } = req.body;
  const { _id } = req.authUser;

  // Check if Category exists by ID
  const category = await categoryModel.findOne({
    _id: categoryId,
    createdBy: _id,
  });
  if (!category) {
    return next(new Error("Invalid CategoryID", { cause: 400 }));
  }

  // Check on Name
  if (name) {
    //check that new name is different from the old name
    if (category.name == name) {
      return next(
        new Error(
          "you entered the same name Category,Please enter a different one",
          {
            cause: 400,
          }
        )
      );
    }

    //check the new name is unique
    const findCategory = await categoryModel.findOne({ name });
    if (findCategory) {
      return next(
        new Error("This name is already used please enter a different one", {
          cause: 400,
        })
      );
    }

    // Update name
    category.name = name;
  }

  // Update userId who Updates the Category
  category.updatedBy = _id;
  await category.save();
  res.status(200).json({ message: "Category updated successfully", category });
};

// ===================== Get All Categories =================

const getAllCategories = async (req, res, next) => {
  const { _id } = req.authUser;
  const { page, size } = req.query;
  const { limit, skip } = paginationFunction({ page, size });
  const Categories = await categoryModel
    .find({ createdBy: _id })
    .populate([
      {
        path: "Tasks",
        select: "title -_id",
      },
    ])
    .limit(limit) // using Pagination
    .skip(skip);
  if (getAllCategories.length) {
    res.status(200).json({ message: "Done", Categories });
  } else {
    next(new Error("No Categories found"));
  }
};

//=========================== Sort from Class =========================
const listProducts = async (req, res, next) => {
  const { _id } = req.authUser;
  const ApiFeaturesInstance = new ApiFeatures(
    categoryModel.find({ createdBy: _id }),
    req.query
  ).filters(); // Using filters

    // Sort
  // const categories = await categoryModel.find().sort(sort.replaceAll("&", " "));

  // Select
  // const categories = await categoryModel.find().select(select.replaceAll("&", " "));

  /* Search
  const categories = await categoryModel.find({
    $or: [
      { title: { $regex: search, $options: "i" } },
      { desc: { $regex: search, $options: "i" } },
    ],
  });
  */
  const categories = await ApiFeaturesInstance.mongooseQuery;
  if (categories.length) {
    res.status(200).json({ message: "Done", categories });
  } else {
    next(new Error("No categories found", { cause: 400 }));
  }
};

// ===================== Delete Category =================

const deleteCategory = async (req, res, next) => {
  const { categoryId } = req.query;
  const { _id } = req.authUser;

  // Check if the School exists
  // const findSchool = await schoolModel.findById(schoolId);
  // if (!findSchool) {
  //   return next(new Error("Invalid SchoolId", { cause: 400 }));
  // }

  // Check if Category is exists and Delete from DataBase
  const categoryExists = await categoryModel.findOneAndDelete({
    _id: categoryId,
    createdBy: _id,
  });
  if (!categoryExists) {
    return next(new Error("Invalid CategoryId", { cause: 400 }));
  }

  res.status(200).json({ message: "Category deleted successfully" });
};

export {
  addCategory,
  updateCategory,
  getAllCategories,
  listProducts,
  deleteCategory,
};
