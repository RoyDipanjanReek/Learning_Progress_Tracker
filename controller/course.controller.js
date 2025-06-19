import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { ApiError, catchAsync } from "../middleware/error.middleware.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

// CREATE COURSE Controller Start Here--
export const createNewCourse = catchAsync(async (req, res) => {
  // TO create a course we need all these input from instructor
  const { title, subTitle, description, catagory, price } = req.body;

  let thumbnail;

  //Thumbnail uplode via cloudinary
  if (req.file) {
    const result = await uploadMedia.apply(req.file.path);
    thumbnail = result?.secure_url || req.file.path;
  } else {
    throw new ApiError("Course thumbnail is required", 400);
  }

  //If everything is ok then comes to create course
  const course = await Course.create({
    title,
    subTitle,
    description,
    thumbnail,
    catagory,
    price,
    instructor: req.id,
  });

  // To check if the instructor exist or not
  await User.findByIdAndUpdate(req.id, {
    $push: { createdCourses: course.id },
  });

  //if exists then return responce thet "Course created successfully"
  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: course,
  });
});

// UPDATE COURSE DETAILS Controller Start Here--
export const updateCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { title, subtitle, description, catagory, level, price } = req.body;

  //Find the user using this courseId
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError("Course not found", 404);
  }

  //checking the ownership here (Only owner can update the course)
  if (course.instructor.toString() !== req.id) {
    throw new ApiError("Not authorized to update this course", 403);
  }

  let thumbnail;
  if (req.file) {
    if (course.thumbnail) {
      await deleteMediaFromCloudinary(course.thumbnail);
    }
    const result = await uploadMedia(req.file.path);
    thumbnail = result.secure_url || req.file.path;
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    {
      title,
      subtitle,
      description,
      catagory,
      level,
      price,
      ...(thumbnail && { thumbnail }),
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Course Update successfully",
    data: updatedCourse,
  });
});

// Get ALl Published Course Controller Start Here--
export const getAllPublishedCourses = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [courses, total] = await Promise.all([
    Course.find({ isPublished: true })
      .populate({
        path: "instructor",
        select: "name avatar",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Course.countDocuments({ isPublished: true }),
  ]);

  res.status(200).json({
    success: true,
    data: courses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});
