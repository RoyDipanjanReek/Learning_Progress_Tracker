import express from "express";
import {checkHealth} from "../controller/healthCheck.controller.js"

const router = express.Router()

/**
 * @swagger
 * /healthCheck:
 *   get:
 *     summary: Check server and DB health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 */

router.get("/", checkHealth )

export default router