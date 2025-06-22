import express from "express";
import { sendEmail } from "../utils/email.js";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const { userId, courseId, milestone } = req.body;

    const user = await User.findById(userId);
    const course = await User.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: "User or course not found" });
    }

    const subject = `📚 Reminder: ${milestone} in ${course.title}`;
    const html = `
      <h2>Hello ${user.name},</h2>
      <p>This is a friendly reminder that you've reached the <strong>${milestone}</strong> milestone in your course <strong>${course.title}</strong>.</p>
      <p>Keep up the great work! 🚀</p>
    `;

    await sendEmail({ to: user.email, subject, html });

    res.status(200).json({ message: "Email notification sent!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email" });
  }
});

export default router;
