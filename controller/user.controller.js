import { User } from "../models/user.model.js";
import { ApiError, catchAsync } from "../middleware/error.middleware.js";
import {generateToken} from "../utils/generateToken.js"
//Function to create new user(Sign up user)
export const createUserAccount = catchAsync(async (req, res) => {
    //Take inputs from Body 
  const { name, email, password, role = "student" } = req.body;

  //Check if the email exist or not 
 const existingUser = await User.findOne({ email: email.toLowerCase() });

  //If email already exist it will throw Error 
  if (existingUser) {
    throw new ApiError("User already Exists", 400);
  }

  //If everythings is ok user can create their account 
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password, // Password Hashing is handle by model
    role,
  });


 await user.updateLastActive();
  generateToken(res, user._id, "Account created successfully");
});


export const authenticatUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find user and check password
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  if (!user || !(await user.comparePassword(String(password)))) {
  throw new ApiError("Invalid email or password", 401);
}

  // Update last active and generate token
  await user.updateLastActive();
  generateToken(res, user._id, `Welcome back ${user.name}`);
});

export const signOutUser = catchAsync(async (_, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({
    success: true,
    message: "Signout Successfully",
  });
});