import express from "express"
import { saleTicketController } from "../controllers/saleTicketController.js"
import { validateAuthCookieMdd } from "../middlewares/authCookieMiddelware.js"

export const saleTicketRouter = express.Router()

saleTicketRouter.route("/").get(validateAuthCookieMdd(["ADMIN"]),saleTicketController.getAllSales).post(validateAuthCookieMdd(["ADMIN"]), saleTicketController.insertSale)

saleTicketRouter.route("/:id").put(validateAuthCookieMdd(["ADMIN", "CLIENT"]), saleTicketController.updateSale).delete(validateAuthCookieMdd(["ADMIN"]), saleTicketController.deleteSale)