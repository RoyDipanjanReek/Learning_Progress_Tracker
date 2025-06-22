# 📘 Learning Progress Tracker – Backend API

A full-featured backend built with **Node.js**, **Express**, and **MongoDB** for tracking user learning progress in an online course platform.

This project provides secure authentication, course management, progress analytics, and a fully documented RESTful API with **Swagger UI**.

---

## 🚀 Features

- ✅ **User Registration & Authentication**  
  Secure signup/login using **JWT** authentication and **role-based access control**.

- 📚 **Course Management**  
  Instructors can create, update, and publish courses with media support via **Cloudinary**.

- 👥 **Enrollment System**  
  Users can enroll and unenroll from available courses.

- 📊 **Progress Tracking**  
  Track progress at the lecture/module level for each enrolled course.

- 📈 **Progress Analytics**  
  Retrieve stats like completion percentage, active streaks, and time spent.

- 🔐 **Role Management**  
  Includes access control for `User`, `Instructor`, and `Admin` roles.

- 🧪 **Validation & Error Handling**  
  Clean validation using custom middlewares and consistent error responses.

- 📄 **API Documentation**  
  Built-in Swagger UI at `/api-docs` for interactive API exploration.

---

## 🛠️ Tech Stack

- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Cloudinary** (media uploads)
- **Stripe** (for payments)
- **Swagger UI** (API docs)
- **Render** (deployment)

---

## 🔐 Environment Variables

Make sure to configure these in your `.env` file (and Render dashboard):

``` env
PORT=8080
NODE_ENV= production or development
CLIENT_URL=https://your-frontend-url

# MongoDB
MONGO_URI=mongodb+srv://...

# Auth
JWT_SECRET=your_jwt_secret
SECRET_TOKEN=your_token

# Cloudinary
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🚀 Getting Started (Local Setup)
### 1. Clone the repo
``` bash
git clone https://github.com/yourusername/learning-progress-tracker-backend.git
cd learning-progress-tracker-backend
```

### 2. Install dependencies
``` bash
npm install
```
### 3. Configure .env file
**(see above)**

### 4. Run the server
``` bash
npm run dev  # for development

```
### 5. View API Docs (```Swagger```)

Navigate to - [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

---
___

# 📡 API Endpoints
- Here’s a sample of what’s available (see Swagger UI for full list):

| Method | Endpoint | Description |
|--------| -------- | ----------- |
|POST|```/api/v1/user/register```|Register a new user|
|POST|```/api/v1/user/login```|	User login|
|GET|```/api/v1/course```|Get all published courses|
|POST|```/api/v1/course```|Create new course (instructor)|
|PATCH|```/api/v1/course/c/:courseId```|Update course details|
|POST|```/api/v1/enroll/:courseId```|Enroll in a course|
|GET|```/api/v1/progress/:courseId```|Get user progress for a course|
|POST|```/api/v1/checkout/create-checkout-session```|Start Stripe payment session|

___
---

# 🌐 Deployment
### This backend is deployed using Render.
- You can access the live API docs here:

[**```👉 https://your-backend.onrender.com/api-docs```**](https://your-backend.onrender.com/api-docs)

---

#  Postman Collections 
### This backend is deployed using Render.
- You can access all the postman collection here:  

## [**```👉 My Postman Collections are here```**](https://dipanjan-2471.postman.co/workspace/Dipanjan-Workspace~68e6bc86-d7fa-4854-952e-9e74a0fc0258/collection/37879127-1e13fd06-e82c-448e-b8d8-9402ab141765?action=share&creator=37879127)

![Postman](https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg)

---

# 👨‍💻 Author
### **```Dipanjan Roy```**
Aspiring Backend Developer | Loves building & documenting clean APIs

- [**```LinkedIn```**](https://www.linkedin.com/in/roydipanjan2003/) 
- [**```GitHub```**](https://x.com/Dipanjan1572003)

---
 ### ⭐ Credits
 - Express.js
 - MongoDB Atlas
 - Cloudinary
 - Stripe
 - Swagger

 ___
---

# 📌 License
This project is licensed under the MIT License — feel free to use, modify, and contribute.