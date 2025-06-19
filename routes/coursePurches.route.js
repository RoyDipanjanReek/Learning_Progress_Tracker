import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { initialStripeCheckout } from "../controller/coursePurchas.controller.js";

const router = express.Router()

router
.route("/checkout/create-checkout-session")
.post(isAuthenticated, initialStripeCheckout)

export default router