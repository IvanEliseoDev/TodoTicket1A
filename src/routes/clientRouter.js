import express from "express"
import { clientController } from "../controllers/clientsController.js"
import { authClientController } from "../controllers/authClient.js"

export const clientRouter = express.Router()

clientRouter.route("/").get(clientController.getAllClients)
clientRouter.route("/regiser").get(clientController.registerClient)
clientRouter.route("/login").get(authClientController.loginClient)
clientRouter.route("/logOut").get(authClientController.logOut)
clientRouter.route("/verifyCode").get(authClientController.verifyCode)
