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

// Function to register a user (Login a user)
export const authenticatUser = catchAsync(async (req, res) => {
  const { email, password } = req.body; //Takes Email & Password form Body 

  // Find user using Email Address (Email is an unique Identity)
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  //If user not found or the password is incorrect
  if (!user || !(await user.comparePassword(String(password)))) {
  throw new ApiError("Invalid email or password", 401);
}

  // Update last active and generate token if everything is ok
  await user.updateLastActive();
  generateToken(res, user._id, `Welcome back ${user.name}`);
});


//Function to Sign out a user(Sign out user)
export const signOutUser = catchAsync(async (_, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({
    success: true,
    message: "Signout Successfully",
  });
});