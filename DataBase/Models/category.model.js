import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// ================== Virtual Method =================

categorySchema.virtual("Tasks", {
  ref: "Task",
  foreignField: "categoryId",
  localField: "_id",
  // justOne:true  // To get only the first element
});

const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
