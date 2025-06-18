import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLenght: [50, "Title can not exceed 50 charecter"],
    },
    subTitle: {
      type: String,
      trim: true,
      maxLenght: [100, "Title can not exceed 50 charecter"],
    },
    description: {
      type: String,
      trim: true,
    },
    catagory: {
      type: String,
      trim: true,
      required: [true, "Course catagory is required"],
    },
    level: {
      type: String,
      enum: {
        values: ["biginer", "intermediate", "expert"],
        message: "please select a valid course level",
      },
      default: "biginer",
    },
    price: {
      type: Number,
      required: [true, "Course price is required"],
      min: [0, "Course price must be non- negative"],
    },
    thumbnail: {
      type: String,
      required: [true, "Course thumbnail is required"],
    },
    enrolledStudent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lecture: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Course instructor is required"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    totalLecture: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);


export const Course = mongoose.model("Course", courseSchema)