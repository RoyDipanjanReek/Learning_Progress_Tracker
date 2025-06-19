import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import {
  createNewCourse,
  updateCourse,
  getAllPublishedCourses,
} from "../controller/course.controller.js";

import uplode from "../utils/multer.js";

const router = express.Router();
//Public Route
router.get("/published", getAllPublishedCourses);

//To Protect all private route
router.use(isAuthenticated);

// create course route
router
  .route("/")
  .post(restrictTo("instructor"), uplode.single("thumbnail"), createNewCourse);

router
  .route("/c/:courseId")
  .patch(restrictTo("instructor"), uplode.single("thumbnail"), updateCourse);

export default router;
