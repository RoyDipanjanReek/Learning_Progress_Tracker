import { User } from "../models/user.model.js";
import { ApiError, catchAsync } from "./error.middleware.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError("You are not logged in", 401);
  }

  try {
    const decoded = await jwt.verify(token, process.env.SECRET_TOKEN);

    // add user ID to request
    req.id = decoded.userId;

    const user = await User.findById(req.id);
    if (!user) {
      throw new ApiError("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new ApiError("Token is invalid", 404);
    }
    if (error.name === "TokenExpiredError") {
      throw new ApiError("Your token has expire. Please login again", 404);
    }

    throw error;
  }
});


//middleware to control role based access
export const restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        "You dont have permission to perform this action",
        403
      );
    }
    next();
  });
};

// Optional authentiication
export const optionalAuth = catchAsync(async(req,res, next) => {
   try {
      const token = req.cookies.token

      if(token){
         const decoded = await jwt.verify(token, process.env.JWT_SECRET)
         req.id = decoded.userId
      }
      next()
   } catch (error) {
      next()
   }
})
