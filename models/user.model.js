import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxLength: [50, "Name can not exceed 50 charecter"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password must be atleast 8 charecter"],
    select: false,
  },
  role: {
    type: String,
    enum: {  // For Role Management
      values: ["student", "instractor", "admin"], 
      message: "Please select a valid role",
    },
    default: "student",
  },
  avater: {
    type: String,
    default: "default-avater.png",
  },
  bio: {
    type: String,
    maxLength: [200, "Bio can not exceed 200 charceter"],
  },
  enrolledCourse: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      enrolledAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  lastActive: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Update lastActive timestamp
userSchema.methods.updateLastActive = function () {
  this.lastActive = Date.now();
  return this.save({ validateBeforeSave: false });
};

//Hashed password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next;
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (typeof enteredPassword !== "string" || typeof this.password !== "string") {
    throw new Error("Passwords must be strings for comparison.");
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

  

export const User = mongoose.model("User", userSchema);