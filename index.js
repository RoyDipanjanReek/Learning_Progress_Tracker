import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
// import mongooseSanitizer from "mongoose-sanitizer";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js"
import connectDB from "./database/db.js";
import healthCheck from "./routes/healthCheck.route.js";
import CourseProgress  from "./routes/courseProgress.route.js";
import coursePurchase from "./routes/coursePurches.route.js"
//Config Dotenv Here
dotenv.config();

//Connect our Database from here
await connectDB();

const app = express();
const PORT = process.env.PORT;

//Global rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: "Too many request from this IP, please try later",
});

//All security middleware are here
app.use(helmet());
app.use(hpp()); //Express middleware to protect against HTTP Parameter Pollution attacks
app.use("/api", limiter);
app.use(cookieParser());

//logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Body Parser Middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

//Global error handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

//CORS Configuration are here
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTION"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remember-token",
      "Access-Control-Allow-Origin",
      "Origin",
      "Accept",
    ],
  })
);

// All Api Routes are here--
app.use("/api/v1/user", userRoute);  //<----User Route is here
app.use("/api/v1/course", courseRoute) //<---- Course Route is here
app.use("/healthCheck", healthCheck) //<---- Health Check Route is here
app.use("/api/v1/courseProgress",CourseProgress) //<---- Course Progress Route is here
app.use("/api/v1/coursePurchase",coursePurchase) //<---- Course Purchase Route is here

//404 handler are here--
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT} in ${process.env.NODE_ENV} mode`);
});
