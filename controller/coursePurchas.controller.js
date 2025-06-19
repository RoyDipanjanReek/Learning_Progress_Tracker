import { Course } from "../models/course.model.js";
import { ApiError, catchAsync } from "../middleware/error.middleware.js";
import { User } from "../models/user.model.js";
import { Lecture } from "../models/lecture.model.js";
import Stripe from "stripe";
import {CoursePurchase} from "../models/coursePurchase.model.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const initialStripeCheckout = catchAsync(async (req, res) => {
  const { courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError("Course not found");
  }

  const newPurchase = new CoursePurchase({
    course: courseId,
    user: req.id,
    amount: course.price,
    status: "pending",
    paymentMethod: "stripe",
  });

  // create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: course.title,
            images: [],
          },
          unit_amount: course.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/course-progress/${courseId}`,
    cancel_url: `${process.env.CLIENT_URL}/course-details/${courseId}`,

    metadata: {
      courseId: courseId,
      userId: req.id,
    },
    shipping_address_collection: {
      allowed_countries: ["IN"],
    },
  });

  if (!session.url) {
    throw new ApiError("Failed to checkout session", 400);
  }

  newPurchase.paymentId = session.id;
  await newPurchase.save();

  res.status(201).json({
    success: true,
    data: {
      checkoutUrl: session.url,
    },
  });
});
