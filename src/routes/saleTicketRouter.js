import express from "express"
import { saleTicketController } from "../controllers/saleTicketController.js"

export const saleTicketRouter = express.Router()

saleTicketRouter.route("/").get(saleTicketController.getAllSales).post(saleTicketController.insertSale)

saleTicketRouter.route("/:id").get(saleTicketController.updateSale).post(saleTicketController.deleteSale)