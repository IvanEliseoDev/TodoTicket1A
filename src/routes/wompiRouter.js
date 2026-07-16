import express from "express"
import { wompiController } from "../controllers/wompiController.js"

export const wompiRouter = express.Router()

wompiRouter.route("/generateToken").post(wompiController.generateToken)
wompiRouter.route("/saleWompi").post(wompiController.paymetTest)

