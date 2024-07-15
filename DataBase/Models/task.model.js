import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    textTask: String,
    type: {
      type: String,
      enum: ["Text Task", "List Task"],
      default: "Text Task",
    },
    solvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;