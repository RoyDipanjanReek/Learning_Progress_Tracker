import mongoose from "mongoose";

const lectureProgress = new mongoose.Schema({
  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  watchTime: {
    type: Number,
    default: 0,
  },
  lastWatch: {
    type: Date,
    default: Date.now,
  },
});

const courseProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lectureProgress: [lectureProgress],
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

courseProgressSchema.pre("save", async function () {
  if (this.lectureProgress.length > 0) {
    const completedLecture = this.lectureProgress.filter(
      (lp) => lp.isCompleted
    ).length;
    this.completionPercentage = Math.round(
      (completedLecture / this.lectureProgress.length) * 100
    );
    this.isCompleted = this.completionPercentage === 100;
  }

  next();
});

export const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);
