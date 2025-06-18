import express from "express";
import { 
    createUserAccount, 
    authenticatUser, 
    signOutUser
} from "../controller/user.controller.js";

import { validateSignUp } from "../middleware/validation.middleware.js";

const router = express.Router()

//Auth Routes are Here (Sign-Up, Sign-In)
router.post("/signup", validateSignUp, createUserAccount)
router.post("/signin", authenticatUser)
router.post("/logout", signOutUser)


export default router;