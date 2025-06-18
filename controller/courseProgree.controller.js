import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";
import { ApiError, catchAsync } from "../middleware/error.middleware.js";

export const getUserCourseProgress = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const courseDetaild = await Course.findById(courseId)
    .populate("lecture")
    .select("courseTitle courseThumbnail lecture");

  if (!courseDetaild) {
    throw new ApiError("Course not found", 404);
  }

  const courseProgress = await CourseProgress.findOne({
    course: courseId,
    user: req.id,
  }).populate("course");

  if (!courseProgress) {
    return res.status(200).json({
      success: true,
      data: {
        courseDetaild,
        progress: [],
        isCompleted: false,
        completionPercentage: 0,
      },
    });
  }
});
