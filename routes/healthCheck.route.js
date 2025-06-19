import express from "express";
import {checkHealth} from "../controller/healthCheck.controller.js"

const router = express.Router()

router.get("/", checkHealth )

export default router