import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { getUserCourseProgress } from "../controller/courseProgree.controller.js";

const router = express.Router()

router.get("/:courseId", isAuthenticated, getUserCourseProgress)

export default router